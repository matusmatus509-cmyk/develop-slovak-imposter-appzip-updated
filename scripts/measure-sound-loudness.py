#!/usr/bin/env python3
"""
Meranie a kalibrácia hlasitosti pre minihru „Uhádni zvuk“.

Nahrávky sú externé (Wikimedia Commons), takže sa nedajú normalizovať na
disku. Skript preto nameria každú nahrávku a zapíše do databázy korekciu
`gainDb` (+ `startAt`, ak nahrávka začína tichom), ktorú prehrávač aplikuje
cez Web Audio (client/src/utils/soundClueAudio.ts).

Postup:
  1. načíta runtime pole SOUND_CLUES (cez `npx tsx`, teda presne to, čo hrá hra),
  2. stiahne prvých 12 s každej nahrávky (ffmpeg / curl, slušný User-Agent,
     pauzy a opakovanie pri HTTP 429),
  3. nameria EBU R128 hlasitosť prvých 7 s od `startAt` (predvolená dĺžka
     ukážky v hre), true peak a úvodné ticho,
  4. navrhne zisk: cieľ −18 LUFS, zosilnenie tichých nahrávok so slabým
     odstupom od šumu max. +15 dB (s jasným odstupom max. +24 dB),
  5. s voľbou --calibrate vyrenderuje každý zvuk v Chromiu (Playwright,
     OfflineAudioContext) cez rovnaký reťazec GainNode → DynamicsCompressor
     ako hra a zisk doladí tak, aby výstup sedel na cieľ a nepresiahol 0 dBFS,
  6. s voľbou --write prepíše `gainDb` / `startAt` v teamBattleExtras.ts.

Požiadavky: ffmpeg, curl, Node (npx tsx), pre --calibrate `pip install playwright`
a `python -m playwright install chromium`.

  python3 scripts/measure-sound-loudness.py --report out.json
  python3 scripts/measure-sound-loudness.py --calibrate --write
  python3 scripts/measure-sound-loudness.py --ids sk-cow,sk-lion --report -
"""
import argparse, hashlib, json, math, os, re, subprocess, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "client/src/data/teamBattleExtras.ts"
UA = "SlovakImposterSoundAudit/1.0 (https://github.com/matusmatus509-cmyk/develop-slovak-imposter-appzip-updated)"
TARGET, CEIL, LIMITER_ALLOWANCE, LONG_MAX = -18.0, -1.0, 6.0, -16.0
PREVIEW_SECONDS, CLIP_SECONDS = 7, 12
LIMITER_THRESHOLD, LIMITER_RATIO = -4.5, 20   # musí sedieť s SOUND_LIMITER v soundClueAudio.ts
BASE_VOLUME = 0.9


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def load_runtime():
    code = ("import { SOUND_CLUES } from './client/src/data/teamBattleExtras';"
            "process.stdout.write(JSON.stringify(SOUND_CLUES));")
    r = run(["npx", "tsx", "-e", code], cwd=ROOT)
    if r.returncode:
        sys.exit("Nepodarilo sa načítať SOUND_CLUES:\n" + r.stderr)
    return json.loads(r.stdout)


def commons_meta(urls):
    """Priama URL súboru, veľkosť a dĺžka z Commons API (rieši aj Special:Redirect)."""
    def title(u):
        f = u.split("Special:Redirect/file/")[-1] if "Special:Redirect/file/" in u else u.split("/")[-1]
        return "File:" + urllib.parse.unquote(f).replace("_", " ")
    titles = sorted({title(u) for u in urls})
    meta = {}
    for i in range(0, len(titles), 40):
        q = urllib.parse.urlencode({"action": "query", "titles": "|".join(titles[i:i + 40]), "prop": "imageinfo",
                                    "iiprop": "url|size|mediatype", "format": "json", "formatversion": "2"})
        for attempt in range(6):
            try:
                req = urllib.request.Request("https://commons.wikimedia.org/w/api.php?" + q, headers={"User-Agent": UA})
                data = json.loads(urllib.request.urlopen(req, timeout=40).read())
                break
            except Exception as ex:  # noqa: BLE001
                print("  Commons API retry:", ex, file=sys.stderr); time.sleep(10 * (attempt + 1))
        else:
            sys.exit("Commons API nedostupné")
        for p in data["query"]["pages"]:
            ii = (p.get("imageinfo") or [{}])[0]
            meta[p["title"]] = {"missing": "missing" in p, "url": (ii.get("url") or "").split("?")[0],
                                "size": ii.get("size"), "duration": ii.get("duration"), "mediatype": ii.get("mediatype")}
        time.sleep(3)
    return {u: meta.get(title(u)) for u in urls}


def decoded_seconds(path):
    tm = re.findall(r"time=(\d+):(\d+):([\d.]+)", run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-f", "null", "-"]).stderr)
    return int(tm[-1][0]) * 3600 + int(tm[-1][1]) * 60 + float(tm[-1][2]) if tm else 0.0


def fetch_clip(m, cache):
    key = hashlib.sha1(m["url"].encode()).hexdigest()[:16]
    out = cache / f"{key}.flac"
    expected = min(CLIP_SECONDS, m["duration"] or CLIP_SECONDS)
    if out.exists() and decoded_seconds(str(out)) >= expected - 0.3:
        return out
    raw = cache / f"{key}.raw"
    dur = m["duration"] or CLIP_SECONDS
    nbytes = m["size"] if dur <= CLIP_SECONDS + 2 else int(m["size"] * (CLIP_SECONDS + 2) / dur) + 300_000
    for attempt in range(5):
        r = run(["curl", "-s", "-f", "-A", UA, "--retry", "4", "--retry-delay", "20", "-r", f"0-{nbytes}", "-o", str(raw), m["url"]], timeout=300)
        if r.returncode == 0:
            run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-t", str(CLIP_SECONDS), "-i", str(raw), "-c:a", "flac", "-y", str(out)])
            if decoded_seconds(str(out)) >= expected - 0.3:
                raw.unlink(missing_ok=True)
                return out
        time.sleep(30 * (attempt + 1))
    raw.unlink(missing_ok=True)
    raise RuntimeError(f"nepodarilo sa stiahnuť {m['url']}")


def ebur128(path, start, seconds, verbose=False):
    cmd = ["ffmpeg", "-hide_banner", "-nostats"] + (["-loglevel", "verbose"] if verbose else []) + \
          ["-ss", str(start), "-t", str(seconds), "-i", str(path),
           "-af", "ebur128=peak=true" + (":framelog=verbose" if verbose else ""), "-f", "null", "-"]
    err = run(cmd).stderr
    I = re.findall(r"I:\s+(-?[\d.]+) LUFS", err)
    tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", err)
    M = [float(x) for x in re.findall(r"M:\s*(-?[\d.]+)", err) if float(x) > -70]
    return (float(I[-1]) if I else None), (float(tp[-1]) if tp else None), M


def leading_silence(path):
    err = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "silencedetect=n=-45dB:d=0.3", "-f", "null", "-"]).stderr
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    return ends[0] if starts and starts[0] <= 0.05 and ends else 0.0


def plan_gain(path):
    lead = leading_silence(path)
    start = round(max(0.0, lead - 0.2), 1) if 1.0 < lead <= 4.0 else 0.0
    I7, _, M7 = ebur128(path, start, PREVIEW_SECONDS, verbose=True)
    I10, _, _ = ebur128(path, start, 10)
    _, TP, _ = ebur128(path, start, CLIP_SECONDS - start)
    if I7 is None or I7 <= -69 or TP is None:
        return {"startAt": start, "lead": lead, "gainDb": None, "note": "príliš krátka nahrávka"}
    spread = (max(M7) - sorted(M7)[len(M7) // 10]) if M7 else 0.0
    boost_cap = 24.0 if spread >= 15 else 15.0
    want = TARGET - I7
    g = min(want, (LONG_MAX - I10) if I10 and I10 > -69 else want, CEIL + LIMITER_ALLOWANCE - TP)
    if want > 0:
        g = min(g, boost_cap)
    return {"startAt": start, "lead": lead, "I7": I7, "I10": I10, "TP": TP, "boostCap": boost_cap,
            "gainDb": round(g, 1), "upCap": min(5.0 - TP + 1.5, boost_cap if want > 0 else 99)}


RENDER_JS = """
window.render = async (key, gainDb, startAt, seconds, thr, ratio, base) => {
  const data = await (await fetch('/clip/'+key)).arrayBuffer();
  const buf = await new OfflineAudioContext(2, 44100, 44100).decodeAudioData(data);
  const ctx = new OfflineAudioContext(2, Math.ceil(buf.sampleRate*seconds), buf.sampleRate);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const makeup = -(thr + (0 - thr)/ratio) * 0.6;
  const g = ctx.createGain(); g.gain.value = base * Math.pow(10, (gainDb - makeup)/20);
  const L = ctx.createDynamicsCompressor();
  L.threshold.value = thr; L.knee.value = 0; L.ratio.value = ratio; L.attack.value = 0.003; L.release.value = 0.15;
  src.connect(g); g.connect(L); L.connect(ctx.destination); src.start(0, startAt || 0);
  const out = await ctx.startRendering();
  const c0 = out.getChannelData(0), c1 = out.numberOfChannels > 1 ? out.getChannelData(1) : c0;
  let peak = 0; const pcm = new Int16Array(out.length*2);
  for (let i = 0; i < out.length; i++) {
    peak = Math.max(peak, Math.abs(c0[i]), Math.abs(c1[i]));
    pcm[2*i] = Math.max(-32768, Math.min(32767, Math.round(c0[i]*32767)));
    pcm[2*i+1] = Math.max(-32768, Math.min(32767, Math.round(c1[i]*32767)));
  }
  await fetch('/upload/'+key+'?sr='+buf.sampleRate, {method: 'POST', body: pcm.buffer});
  return {peak, sr: buf.sampleRate};
};
"""


def calibrate(items, cache):
    from playwright.sync_api import sync_playwright  # noqa: import on demand
    rendered = {}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(); page = browser.new_page()

        def handle(route):
            u = route.request.url
            if "/clip/" in u:
                route.fulfill(status=200, content_type="audio/flac", body=(cache / u.split("/clip/")[1]).read_bytes())
            elif "/upload/" in u:
                rendered[u.split("/upload/")[1].split("?")[0]] = route.request.post_data_buffer
                route.fulfill(status=200, body="ok")
            else:
                route.fulfill(status=200, content_type="text/html", body="<html></html>")
        page.route("http://calibrate.test/**", handle)
        page.goto("http://calibrate.test/"); page.add_script_tag(content=RENDER_JS)

        def measure(clip, gain, start):
            r = page.evaluate("([k,g,s,t,th,ra,b])=>render(k,g,s,t,th,ra,b)",
                              [clip.name, gain, start, PREVIEW_SECONDS, LIMITER_THRESHOLD, LIMITER_RATIO, BASE_VOLUME])
            raw = cache / (clip.name + ".s16"); raw.write_bytes(rendered.pop(clip.name))
            err = run(["ffmpeg", "-hide_banner", "-nostats", "-f", "s16le", "-ar", str(r["sr"]), "-ac", "2", "-i", str(raw),
                       "-af", "ebur128", "-f", "null", "-"]).stderr
            raw.unlink()
            return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1]), r["peak"]

        for it in items:
            p = it["plan"]
            if p.get("gainDb") is None:
                continue
            g, steps = min(p["gainDb"], p["upCap"]), []
            for _ in range(4):
                I, pk = measure(it["clip"], g, p["startAt"]); steps.append((round(g, 1), I, pk))
                ng = g - 20 * math.log10(pk / 0.93) if pk >= 0.97 else (min(p["upCap"], g + TARGET - I) if abs(TARGET - I) > 0.4 else g)
                if round(ng, 1) == round(g, 1):
                    break
                g = round(ng, 1)
            safe = [s for s in steps if s[2] < 0.97] or [min(steps, key=lambda s: s[2])]
            best = min(safe, key=lambda s: abs(TARGET - s[1]))
            p.update(gainDb=best[0], renderedLufs=round(best[1], 1), renderedPeak=round(best[2], 4))
        browser.close()


def write_back(items):
    src = DATA.read_text(encoding="utf-8")
    for it in items:
        p = it["plan"]
        pat = re.compile(r'(\{ id: "' + re.escape(it["id"]) + r'",[^\n]*?license: "[^"]*")(, gainDb: -?[\d.]+)?(, startAt: [\d.]+)?')
        add = (f", gainDb: {p['gainDb']}" if p.get("gainDb") is not None else "") + (f", startAt: {p['startAt']}" if p.get("startAt") else "")
        src, n = pat.subn(lambda m: m.group(1) + add, src, count=1)
        if n != 1:
            print(f"  ! {it['id']} sa v súbore nenašiel", file=sys.stderr)
    DATA.write_text(src, encoding="utf-8")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cache", default=str(ROOT / ".cache/sound-clips"))
    ap.add_argument("--ids", help="čiarkou oddelené ID (predvolene všetky hrateľné)")
    ap.add_argument("--calibrate", action="store_true", help="doladiť zisk renderom v Chromiu")
    ap.add_argument("--write", action="store_true", help="zapísať gainDb/startAt do teamBattleExtras.ts")
    ap.add_argument("--report", help="cesta k JSON reportu, '-' = stdout")
    a = ap.parse_args()
    cache = Path(a.cache); cache.mkdir(parents=True, exist_ok=True)
    clues = load_runtime()
    if a.ids:
        wanted = set(a.ids.split(",")); clues = [c for c in clues if c["id"] in wanted]
    meta = commons_meta([c["audioUrl"] for c in clues])
    items = []
    for n, c in enumerate(clues, 1):
        m = meta[c["audioUrl"]]
        if not m or m["missing"] or m["mediatype"] != "AUDIO":
            print(f"[{n}/{len(clues)}] {c['id']}: súbor na Commons chýba!", file=sys.stderr); continue
        clip = fetch_clip(m, cache)
        plan = plan_gain(clip)
        items.append({"id": c["id"], "label": c["label"], "clip": clip, "plan": plan, "current": c.get("gainDb")})
        print(f"[{n}/{len(clues)}] {c['id']}: {plan.get('I7')} LUFS -> gain {plan.get('gainDb')} dB", file=sys.stderr)
        time.sleep(1.5)
    if a.calibrate:
        calibrate(items, cache)
    if a.write:
        write_back(items)
    if a.report:
        rep = [{"id": i["id"], "label": i["label"], "currentGainDb": i["current"], **{k: v for k, v in i["plan"].items() if k != "upCap"}} for i in items]
        txt = json.dumps(rep, ensure_ascii=False, indent=1)
        (sys.stdout.write(txt + "\n") if a.report == "-" else Path(a.report).write_text(txt, encoding="utf-8"))


if __name__ == "__main__":
    main()
