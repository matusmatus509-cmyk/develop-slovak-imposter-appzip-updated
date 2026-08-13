from __future__ import annotations

import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Any

import requests

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "data" / "quiz-master.raw.json"
MODEL = "gpt-5-nano"
BATCH_SIZE = 10

CATEGORIES: list[tuple[str, list[str]]] = [
    ("🌍 Geografia", [
        "krajiny, hlavné mestá, kontinenty, oceány, moria, veľké ostrovy a prielivy",
        "rieky, jazerá, pohoria, púšte, sopky, vodopády, národné parky a geografické rekordy",
        "mestá, pamiatky, hranice, vlajky, regióny, polohy štátov a charakteristické geografické znaky",
    ]),
    ("🔬 Veda", [
        "fyzika, chémia, meracie jednotky, materiály, energia, elektrina, svetlo a zvuk",
        "biológia, ľudské telo, rastliny, bunky, ekológia, geológia a prírodné javy",
        "vesmír, Slnečná sústava, hviezdy, galaxie, kozmické misie a základná astronómia",
    ]),
    ("📜 História", [
        "staroveké civilizácie, antické Grécko a Rím, dejiny stavieb a archeologické objavy",
        "stredovek, renesancia, moreplavci, vynálezy, významné osobnosti a vývoj umenia",
        "novovek, európske dejiny, dejiny Slovenska, vedecké objavy a globálne historické udalosti",
    ]),
    ("🏆 Šport", [
        "futbal, hokej, tenis, basketbal, volejbal, hádzaná a stabilné pravidlá loptových športov",
        "atletika, plávanie, gymnastika, lyžovanie, cyklistika, olympijské disciplíny a športové vybavenie",
        "motoršport, golf, bojové športy, šípky, šach, curling, lukostreľba a všeobecné športové pravidlá",
    ]),
    ("🎬 Filmy a seriály", [
        "nadčasové filmy, animované filmy, rozprávky, ich postavy, prostredia a dejové fakty",
        "známe seriály, filmové ságy, režiséri, filmové profesie, ocenenia a technické filmové pojmy",
        "svetová popkultúra vo filme, sci-fi, fantasy, komiksy, hrdinovia a ikonické fiktívne svety",
    ]),
    ("🎵 Hudba", [
        "hudobné nástroje, rodiny nástrojov, noty, hlasové rozsahy, hudobné pojmy a žánre",
        "klasická hudba, skladatelia, diela, orchestre, koncertné formy a hudobná história",
        "známi interpreti, skupiny, trvalé hity, slovenská hudba a hudobné kultúrne fakty",
    ]),
    ("🎨 Umenie a knihy", [
        "maliari, sochári, architektúra, slávne diela, umelecké smery a múzeá",
        "svetová literatúra, autori, knihy, literárne postavy, žánre a základné literárne pojmy",
        "slovenská literatúra, divadlo, poézia, umelecké techniky, materiály a kultúrne fakty",
    ]),
    ("🍝 Jedlo a život", [
        "kuchyne sveta, tradičné jedlá, suroviny, koreniny, nápoje a základné gastronomické pojmy",
        "varenie, pečenie, skladovanie potravín, stolovanie, výživa a bežné domáce praktické fakty",
        "ovocie, zelenina, obilniny, syry, dezerty, káva, čaj a dlhodobo platné fakty o jedle",
    ]),
    ("🇸🇰 Slovensko", [
        "slovenská geografia, mestá, regióny, rieky, pohoria, národné parky a prírodné pamiatky",
        "slovenské dejiny, štátne symboly, osobnosti, vynálezy, pamiatky a UNESCO",
        "slovenská kultúra, jazyk, folklór, tradičné jedlá, šport a všeobecne známe fakty",
    ]),
    ("💡 Technológie", [
        "počítače, internet, hardvér, siete, súbory, digitálna bezpečnosť a všeobecné pojmy",
        "vynálezy, komunikácia, fotografia, rádio, televízia, doprava a história technológií",
        "programovanie, web, mobilné zariadenia, navigácia, digitálne médiá a stabilné technologické fakty",
    ]),
]

SCHEMA: dict[str, Any] = {
    "type": "json_schema",
    "json_schema": {
        "name": "slovak_quiz_batch",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "items": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "factKey": {"type": "string"},
                            "question": {"type": "string"},
                            "options": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "correctIndex": {"type": "integer", "enum": [0, 1, 2, 3]},
                        },
                        "required": ["factKey", "question", "options", "correctIndex"],
                        "additionalProperties": False,
                    },
                },
            },
            "required": ["items"],
            "additionalProperties": False,
        },
    },
}


def normalize(text: Any) -> str:
    return re.sub(r"[^a-z0-9]+", "_", str(text).lower()).strip("_")


def validate_batch(items: list[dict[str, Any]], known_keys: set[str], known_questions: set[str]) -> list[str]:
    errors: list[str] = []
    if len(items) != BATCH_SIZE:
        errors.append(f"očakávalo sa {BATCH_SIZE} položiek, získalo sa {len(items)}")
    seen_keys: set[str] = set()
    seen_questions: set[str] = set()
    for index, item in enumerate(items, start=1):
        fact_key = item.get("factKey", "")
        question = item.get("question", "")
        options = item.get("options", [])
        correct_index = item.get("correctIndex")
        if not re.fullmatch(r"[a-z0-9]+(?:_[a-z0-9]+)*", fact_key):
            errors.append(f"položka {index}: neplatný FACT_KEY {fact_key!r}")
        if fact_key in known_keys or fact_key in seen_keys:
            errors.append(f"položka {index}: duplicitný FACT_KEY {fact_key}")
        seen_keys.add(fact_key)
        normalized_question = normalize(question)
        if not question.endswith("?") or len(question) < 12:
            errors.append(f"položka {index}: neprirodzená alebo neúplná otázka")
        if normalized_question in known_questions or normalized_question in seen_questions:
            errors.append(f"položka {index}: duplicitná otázka")
        seen_questions.add(normalized_question)
        if len(options) != 4 or len({normalize(option) for option in options}) != 4:
            errors.append(f"položka {index}: možnosti nie sú štyri jedinečné položky")
        if correct_index not in [0, 1, 2, 3]:
            errors.append(f"položka {index}: neplatný correctIndex")
        if any(not option.strip() for option in options):
            errors.append(f"položka {index}: prázdna možnosť")
    return errors


def request_batch(category: str, focus: str, batch_number: int, known_keys: set[str], known_questions: set[str], category_keys: set[str]) -> list[dict[str, Any]]:
    forbidden_keys = ", ".join(sorted(category_keys))
    prompt = f"""Vytváraš JEDNU dávku presne 10 kvalitných slovenských otázok pre spoločenský kvíz.

Kategória: {category}
Tematické zameranie tejto dávky: {focus}
Dávka: {batch_number}/15 v rámci danej kategórie.

Povinné pravidlá:
- Vráť iba jeden platný JSON objekt s kľúčom "items" a poľom 10 položiek; nič navyše. Každá položka musí mať presne kľúče "factKey", "question", "options" a "correctIndex".
- Pracuj výhradne v prirodzenej spisovnej slovenčine s diakritikou.
- Každá položka musí testovať JEDEN nový, stabilný a jednoznačný faktický koncept.
- Všetkých 10 FACT_KEY musí byť v anglickom snake_case a musí označovať význam faktu, nie formuláciu otázky.
- Nepouži žiadny rovnaký ani obsahovo ekvivalentný fakt ako FACT_KEY z nasledovného zoznamu už použitých konceptov v tejto kategórii: {forbidden_keys or "(žiadne predchádzajúce FACT_KEY)"}. Jedinečnosť voči celej databáze sa následne kontroluje automaticky.
- Otázky nesmú testovať aktuálne, meniace sa ani subjektívne fakty.
- Nepoužívaj šablónové série typu desiatky hlavných miest, desiatky autorov ani desiatky rokov; zvoľ pestrú zmes faktov.
- Každá otázka musí mať presne 4 vierohodné možnosti rovnakého typu (napr. všetko mestá, osoby, krajiny, roky alebo odborné pojmy).
- Presne jedna možnosť je správna; correctIndex je index správnej možnosti od 0 po 3.
- Správnu odpoveď umiestňuj rovnomerne medzi indexy 0, 1, 2 a 3.
- Nesmie existovať prázdna, opakovaná ani očividne nezmyselná možnosť.
- Overuj si fakty podľa všeobecne známej a stabilnej znalosti. Pri pochybnosti vyber iný fakt.
- Nepridávaj vysvetlenia, zdroje, úroveň náročnosti ani cudzojazyčné preklady.
"""
    endpoint = os.environ["OPENAI_API_BASE"].rstrip("/") + "/chat/completions"
    response = requests.post(
        endpoint,
        headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}", "Content-Type": "application/json"},
        json={
            "model": MODEL,
            "messages": [
                {"role": "system", "content": "Si mimoriadne presný slovenský editor vedomostného kvízu. Vráť len platný JSON podľa zadanej štruktúry."},
                {"role": "user", "content": prompt},
            ],
            "max_completion_tokens": 3000,
            "reasoning": {"effort": "minimal"},
        },
        timeout=90,
    )
    response.raise_for_status()
    body = response.json()
    choices = body.get("choices") or []
    if not choices:
        raise RuntimeError(f"Model nevrátil žiadne voľby: {body}")
    content = choices[0].get("message", {}).get("content")
    if not content:
        raise RuntimeError(f"Model nevrátil obsah: {body}")
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:].strip()
    if content.endswith("```"):
        content = content[:-3].strip()
    items = json.loads(content)["items"]
    for item in items:
        if not item.get("factKey") and item.get("fact_key"):
            item["factKey"] = item["fact_key"]
        if item.get("correctIndex") is None and item.get("correct_index") is not None:
            item["correctIndex"] = item["correct_index"]
        item["factKey"] = str(item.get("factKey", ""))
        item["question"] = str(item.get("question", ""))
        if isinstance(item.get("options"), list):
            item["options"] = [str(option) for option in item["options"]]
    return items


def main() -> int:
    all_items: list[dict[str, Any]] = []
    if OUT.exists():
        all_items = json.loads(OUT.read_text(encoding="utf-8"))
        print(f"Obnovujem tvorbu od {len(all_items)} už zapísaných otázok.", flush=True)
    known_keys: set[str] = {item["factKey"] for item in all_items}
    known_questions: set[str] = {normalize(item["question"]) for item in all_items}

    for category_index, (category, focuses) in enumerate(CATEGORIES, start=1):
        completed_in_category = sum(1 for item in all_items if item["category"] == category)
        if completed_in_category % BATCH_SIZE:
            raise RuntimeError(f"Kategória {category} nemá úplnú dávku: {completed_in_category} položiek.")
        for batch_index in range(completed_in_category // BATCH_SIZE + 1, 16):
            focus = focuses[(batch_index - 1) % len(focuses)]
            for attempt in range(1, 6):
                print(f"Tvorím {category} — dávka {batch_index}/15, pokus {attempt}...", flush=True)
                try:
                    category_keys = {item["factKey"] for item in all_items if item["category"] == category}
                    items = request_batch(category, focus, batch_index, known_keys, known_questions, category_keys)
                    errors = validate_batch(items, known_keys, known_questions)
                except (requests.RequestException, ValueError, KeyError) as error:
                    errors = [f"dočasná chyba služby alebo formátu: {error}"]
                if not errors:
                    for item_index, item in enumerate(items, start=1):
                        item["id"] = f"quiz-{category_index:02d}-{(batch_index - 1) * BATCH_SIZE + item_index:03d}"
                        item["category"] = category
                        item["answer"] = item["options"][item["correctIndex"]]
                    all_items.extend(items)
                    known_keys.update(item["factKey"] for item in items)
                    known_questions.update(normalize(item["question"]) for item in items)
                    OUT.write_text(json.dumps(all_items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                    break
                print("Dávka neprešla základnou kontrolou: " + "; ".join(errors[:6]), flush=True)
                time.sleep(5)
            else:
                raise RuntimeError(f"Nepodarilo sa vytvoriť platnú dávku pre {category}, dávka {batch_index}.")

    if len(all_items) != 1500:
        raise RuntimeError(f"Očakávalo sa 1500 položiek, vzniklo {len(all_items)}.")
    print(f"Hotovo: {len(all_items)} otázok, {len(known_keys)} FACT_KEY.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
