#!/usr/bin/env python3
"""Dopĺňa slovenský kvíz na najmenej 700 otázok pre každú z dvoch úrovní.

Cieľ je 75 položiek v každej kombinácii 10 kategórií × 2 úrovne, teda presne
1 500 otázok. Každá úspešná dávka sa hneď bezpečne zapíše do JSON súboru.
"""

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
MODEL = "gpt-5-mini"
TARGET_PER_CATEGORY_AND_DIFFICULTY = 75
MAX_BATCH_SIZE = 5
MAX_ATTEMPTS = 10

CATEGORIES: list[tuple[str, list[str]]] = [
    ("🌍 Geografia", [
        "krajiny, hlavné mestá a štátne symboly", "svetové rieky, jazerá, moria a oceány",
        "pohoria, sopky, púšte a prírodné rekordy", "mestá, pamiatky a geografické polohy",
        "ostrovy, prielivy, polostrovy a prieplavy", "národné parky, podnebie a biomasy",
        "regióny, hranice a svetadiely", "mapy, zemepisné rekordy a zaujímavosti",
    ]),
    ("🔬 Veda", [
        "základy fyziky, pohyb, sila a energia", "svetlo, zvuk, elektrina a magnetizmus",
        "chémia, prvky, látky a bežné reakcie", "ľudské telo, zdravá anatómia a zmysly",
        "bunky, rastliny, živočíchy a ekológia", "geológia, počasie a prírodné javy",
        "Slnečná sústava, planéty a vesmír", "meranie, vedecké prístroje a jednotky",
    ]),
    ("📜 História", [
        "staroveké civilizácie, Grécko a Rím", "stredovek, hrady, panovníci a objavitelia",
        "renesancia, reformácia a veľké vynálezy", "18. a 19. storočie vo svete",
        "20. storočie a významné globálne udalosti", "dejiny Slovenska a strednej Európy",
        "archeologické nálezy, pamiatky a kultúrne dejiny", "historické osobnosti a ich diela",
    ]),
    ("🏆 Šport", [
        "futbal, hokej a stabilné pravidlá tímových športov", "tenis, basketbal, volejbal a hádzaná",
        "atletika, gymnastika a olympijské disciplíny", "plávanie, vodné športy a cyklistika",
        "zimné športy a športové vybavenie", "bojové športy, šach, šípky a lukostreľba",
        "motoršport, golf a menej bežné športy", "stabilné športové pojmy, symboly a rekordy",
    ]),
    ("🎬 Filmy a seriály", [
        "nadčasové filmy, ich postavy a príbehy", "animované filmy, rozprávky a štúdiá",
        "fantasy, sci-fi, komiksy a fiktívne svety", "známe seriály, postavy a prostredia",
        "filmové ságy, adaptácie a knižné predlohy", "režiséri, herci a filmové profesie",
        "filmové techniky, ocenenia a žánre", "svetová popkultúra a ikonické filmové fakty",
    ]),
    ("🎵 Hudba", [
        "hudobné nástroje, rodiny nástrojov a zvuk", "noty, rytmus, dynamika a hudobné pojmy",
        "klasická hudba, skladatelia a známe diela", "orchester, opera, koncerty a spev",
        "hudobné žánre a ich charakteristiky", "známi interpreti a skupiny s trvalým významom",
        "slovenská hudba, tradície a hudobné nástroje", "história hudby, nahrávky a hudobná kultúra",
    ]),
    ("🎨 Umenie a knihy", [
        "maliari, sochári a známe umelecké diela", "architektúra, stavby, múzeá a umelecké smery",
        "svetová literatúra, autori a klasické knihy", "literárne postavy, rozprávky a mýty",
        "žánre, poetika a základné literárne pojmy", "slovenská literatúra, divadlo a poézia",
        "umelecké techniky, materiály a tvorivé odbory", "kultúrne pamiatky, ocenenia a dejiny umenia",
    ]),
    ("🍝 Jedlo a život", [
        "kuchyne sveta, tradičné jedlá a ich pôvod", "ovocie, zelenina, obilniny a základné suroviny",
        "syry, koreniny, nápoje, káva a čaj", "varenie, pečenie a bezpečné skladovanie potravín",
        "stolovanie, kuchynské nástroje a techniky", "výživa a dlhodobo platné praktické fakty",
        "dezerty, pečivo a jedlá z rôznych kultúr", "domácnosť, každodenné návyky a užitočné fakty",
    ]),
    ("🇸🇰 Slovensko", [
        "slovenské mestá, regióny, rieky a pohoria", "národné parky, prírodné pamiatky a jaskyne",
        "dejiny Slovenska, panovníci a dôležité udalosti", "štátne symboly, sviatky a štátne inštitúcie",
        "slovenské hrady, zámky, pamiatky a UNESCO", "slovenské osobnosti, vynálezy a kultúra",
        "folklór, tradície, jedlá a slovenský jazyk", "slovenský šport, umenie a všeobecne známe fakty",
    ]),
    ("💡 Technológie", [
        "počítače, hardvér a digitálne zariadenia", "internet, web, siete a bezpečné digitálne návyky",
        "súbory, programovanie a základné pojmy informatiky", "komunikácia, telefónia, rádio a televízia",
        "fotografia, obraz, zvuk a digitálne médiá", "doprava, navigácia a technické vynálezy",
        "história technológií a významní vynálezcovia", "mobilné zariadenia, navigácia a moderné stabilné pojmy",
    ]),
]

TIER_RULES = {
    "lahke": "Vytváraj ľahšie otázky: všeobecne známe, jasne formulované fakty zvládnuteľné pre bežného dospelého. Nepoužívaj odborné výpočty ani obskúrne detaily.",
    "tazke": "Vytváraj ťažšie otázky: detailnejšie, no stále férové a dlhodobo platné faktické vedomosti. Môžu vyžadovať širší rozhľad, ale nesmú byť nejednoznačné ani úmyselne chytákové.",
}


def normalize(value: Any) -> str:
    return re.sub(r"[^a-z0-9]+", "_", str(value).lower()).strip("_")


def schema(expected_count: int) -> dict[str, Any]:
    return {
        "type": "json_schema",
        "json_schema": {
            "name": "slovak_quiz_batch",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "items": {
                        "type": "array",
                        "minItems": expected_count,
                        "maxItems": expected_count,
                        "items": {
                            "type": "object",
                            "properties": {
                                "factKey": {"type": "string"},
                                "question": {"type": "string"},
                                "options": {"type": "array", "minItems": 4, "maxItems": 4, "items": {"type": "string"}},
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


def validate(items: list[dict[str, Any]], expected: int, known_keys: set[str], known_questions: set[str]) -> list[str]:
    errors: list[str] = []
    if len(items) != expected:
        errors.append(f"očakávalo sa {expected} položiek, získalo sa {len(items)}")
    batch_keys: set[str] = set()
    batch_questions: set[str] = set()
    for index, item in enumerate(items, start=1):
        key = str(item.get("factKey", ""))
        question = str(item.get("question", ""))
        options = item.get("options", [])
        correct_index = item.get("correctIndex")
        normalized_question = normalize(question)
        if not re.fullmatch(r"[a-z0-9]+(?:_[a-z0-9]+)*", key):
            errors.append(f"položka {index}: neplatný FACT_KEY")
        if key in known_keys or key in batch_keys:
            errors.append(f"položka {index}: duplicitný FACT_KEY {key}")
        if not question.endswith("?") or len(question) < 12:
            errors.append(f"položka {index}: neúplná otázka")
        if normalized_question in known_questions or normalized_question in batch_questions:
            errors.append(f"položka {index}: duplicitná otázka")
        if not isinstance(options, list) or len(options) != 4 or len({normalize(option) for option in options}) != 4:
            errors.append(f"položka {index}: možnosti nie sú štyri jedinečné položky")
        if correct_index not in (0, 1, 2, 3):
            errors.append(f"položka {index}: neplatný correctIndex")
        if isinstance(options, list) and any(not str(option).strip() for option in options):
            errors.append(f"položka {index}: prázdna možnosť")
        batch_keys.add(key)
        batch_questions.add(normalized_question)
    return errors


def request_batch(category: str, focus: str, tier: str, expected: int, known_category_keys: set[str]) -> list[dict[str, Any]]:
    forbidden_keys = ", ".join(sorted(known_category_keys))
    prompt = f"""Vytváraš presne {expected} kvalitných slovenských otázok s odpoveďami pre spoločenský kvíz.

Kategória: {category}
Tematické zameranie: {focus}
Úroveň: {tier}
{TIER_RULES[tier]}

Povinné pravidlá:
- Vráť iba platný JSON objekt s poľom "items" presne s požadovaným počtom položiek, bez vysvetlení.
- Každá položka testuje jeden nový, stabilný a jednoznačný faktický koncept.
- FACT_KEY je anglický snake_case, označuje význam faktu a nesmie opakovať ani významovo prekrývať tieto už použité koncepty v rovnakej kategórii: {forbidden_keys or "(žiadne)"}.
- Otázka je prirodzená spisovná slovenčina s diakritikou a končí otáznikom.
- Nepoužívaj aktuálne, meniace sa alebo subjektívne fakty.
- Každá otázka má presne 4 vierohodné možnosti rovnakého typu a iba jednu správnu odpoveď.
- correctIndex je index správnej možnosti od 0 po 3. Správne odpovede rozlož medzi pozície.
- Vyhni sa šablónovým sériám desiatok takmer rovnakých otázok a očividne chybným možnostiam.
"""
    endpoint = os.environ["OPENAI_API_BASE"].rstrip("/") + "/chat/completions"
    response = requests.post(
        endpoint,
        headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}", "Content-Type": "application/json"},
        json={
            "model": MODEL,
            "messages": [
                {"role": "system", "content": "Si precízny slovenský editor faktického kvízu. Vráť výhradne validný JSON."},
                {"role": "user", "content": prompt},
            ],
            "max_completion_tokens": 2800,
            "reasoning": {"effort": "minimal"},
        },
        timeout=150,
    )
    response.raise_for_status()
    body = response.json()
    choices = body.get("choices")
    if not choices:
        raise ValueError(f"model nevrátil choices: {json.dumps(body, ensure_ascii=False)[:1200]}")
    content = choices[0].get("message", {}).get("content")
    if not content:
        raise ValueError(f"prázdna odpoveď modelu: {json.dumps(body, ensure_ascii=False)[:1200]}")
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:].strip()
    if content.endswith("```"):
        content = content[:-3].strip()
    parsed = json.loads(content)
    if isinstance(parsed, list):
        items = parsed
    elif isinstance(parsed, dict) and isinstance(parsed.get("items"), list):
        items = parsed["items"]
    elif isinstance(parsed, dict) and isinstance(parsed.get("questions"), list):
        items = parsed["questions"]
    else:
        raise ValueError(f"JSON neobsahuje pole otázok: {str(parsed)[:500]}")
    for item in items:
        if not isinstance(item, dict):
            continue
        if not item.get("factKey"):
            item["factKey"] = item.get("fact_key") or item.get("fact_key_english") or item.get("key") or normalize(item.get("question", ""))
        if item.get("correctIndex") is None:
            item["correctIndex"] = item.get("correct_index", item.get("correctAnswerIndex"))
        if not item.get("options") and isinstance(item.get("answers"), list):
            item["options"] = item["answers"]
    return items


def next_id(items: list[dict[str, Any]], category_index: int) -> int:
    prefix = f"quiz-{category_index:02d}-"
    values = [int(str(item.get("id", "")).replace(prefix, "")) for item in items if str(item.get("id", "")).startswith(prefix)]
    return max(values, default=0) + 1


def main() -> int:
    if not OUT.exists():
        raise FileNotFoundError(f"Chýba zdrojový súbor: {OUT}")
    all_items: list[dict[str, Any]] = json.loads(OUT.read_text(encoding="utf-8"))
    known_keys = {item["factKey"] for item in all_items}
    known_questions = {normalize(item["question"]) for item in all_items}

    for category_index, (category, focuses) in enumerate(CATEGORIES, start=1):
        for tier in ("lahke", "tazke"):
            completed = sum(1 for item in all_items if item["category"] == category and item.get("difficulty") == tier)
            if completed >= TARGET_PER_CATEGORY_AND_DIFFICULTY:
                print(f"{category} / {tier}: {completed}/{TARGET_PER_CATEGORY_AND_DIFFICULTY} hotovo", flush=True)
                continue
            while completed < TARGET_PER_CATEGORY_AND_DIFFICULTY:
                expected = min(MAX_BATCH_SIZE, TARGET_PER_CATEGORY_AND_DIFFICULTY - completed)
                category_keys = {item["factKey"] for item in all_items if item["category"] == category}
                for attempt in range(1, MAX_ATTEMPTS + 1):
                    focus = focuses[(completed // MAX_BATCH_SIZE + attempt - 1) % len(focuses)]
                    print(f"Tvorím {category} / {tier}: {completed}+{expected}, pokus {attempt}/{MAX_ATTEMPTS}", flush=True)
                    try:
                        items = request_batch(category, focus, tier, expected, category_keys)
                        errors = validate(items, expected, known_keys, known_questions)
                    except (requests.RequestException, ValueError, KeyError, IndexError, TypeError, json.JSONDecodeError) as error:
                        errors = [f"dočasná chyba služby alebo formátu: {error}"]
                    if not errors:
                        start_id = next_id(all_items, category_index)
                        for offset, item in enumerate(items):
                            item["id"] = f"quiz-{category_index:02d}-{start_id + offset:03d}"
                            item["category"] = category
                            item["difficulty"] = tier
                            item["answer"] = item["options"][item["correctIndex"]]
                        all_items.extend(items)
                        known_keys.update(item["factKey"] for item in items)
                        known_questions.update(normalize(item["question"]) for item in items)
                        OUT.write_text(json.dumps(all_items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                        completed += expected
                        break
                    print("Dávka neprešla kontrolou: " + "; ".join(errors[:4]), flush=True)
                    time.sleep(8)
                else:
                    raise RuntimeError(f"Nevznikla platná dávka pre {category} / {tier} po {MAX_ATTEMPTS} pokusoch.")

    counts = {tier: sum(1 for item in all_items if item.get("difficulty") == tier) for tier in ("lahke", "tazke")}
    if any(count < 700 for count in counts.values()):
        raise RuntimeError(f"Cieľ 700 otázok pre každú úroveň nebol splnený: {counts}")
    print(f"Hotovo: {len(all_items)} otázok, úrovne {counts}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
