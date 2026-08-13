#!/usr/bin/env python3
"""Záložné dopĺňanie kvízu z otvoreného zdroja faktických otázok.

Použije iba otázky s výberom zo štyroch možností, automaticky ich preloží do
slovenčiny, zachová správnu odpoveď a po každej otázke bezpečne uloží JSON.
"""

from __future__ import annotations

import base64
import hashlib
import html
import json
import random
import re
import time
from pathlib import Path
from typing import Any

import requests

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "data" / "quiz-master.raw.json"
TARGET = 700
SOURCE_URL = "https://opentdb.com/api.php"
TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"

CATEGORY_MAP = {
    "Entertainment: Books": "🎨 Umenie a knihy",
    "Entertainment: Film": "🎬 Filmy a seriály",
    "Entertainment: Television": "🎬 Filmy a seriály",
    "Entertainment: Musicals & Theatres": "🎬 Filmy a seriály",
    "Entertainment: Music": "🎵 Hudba",
    "Science & Nature": "🔬 Veda",
    "Animals": "🔬 Veda",
    "Geography": "🌍 Geografia",
    "History": "📜 História",
    "Sports": "🏆 Šport",
    "Science: Computers": "💡 Technológie",
    "Science: Gadgets": "💡 Technológie",
}


def normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")


def translate_lines(lines: list[str]) -> list[str]:
    source = "\n".join(lines)
    response = requests.get(
        TRANSLATE_URL,
        params={"client": "gtx", "sl": "en", "tl": "sk", "dt": "t", "q": source},
        timeout=30,
    )
    response.raise_for_status()
    translated = "".join(part[0] for part in response.json()[0])
    result = [line.strip() for line in translated.splitlines()]
    if len(result) != len(lines):
        raise ValueError(f"preklad vrátil {len(result)} namiesto {len(lines)} riadkov")
    return result


def decode_source(value: Any) -> str:
    decoded = base64.b64decode(str(value)).decode("utf-8")
    return html.unescape(decoded).strip()


def translate_question(raw: dict[str, Any]) -> dict[str, Any]:
    question = decode_source(raw["question"])
    correct = decode_source(raw["correct_answer"])
    incorrect = [decode_source(value) for value in raw["incorrect_answers"]]
    lines = translate_lines([question, correct, *incorrect])
    translated_question, translated_correct, *translated_incorrect = lines
    options = [translated_correct, *translated_incorrect]
    if len(options) != 4 or len({normalize(option) for option in options}) != 4:
        raise ValueError("preložené možnosti nie sú štyri jedinečné položky")
    random.shuffle(options)
    return {
        "factKey": "opentdb_" + hashlib.sha1(question.encode("utf-8")).hexdigest()[:16],
        "question": translated_question if translated_question.endswith("?") else translated_question + "?",
        "options": options,
        "correctIndex": options.index(translated_correct),
        "category": CATEGORY_MAP[raw["category"]],
    }


def validate(candidate: dict[str, Any], known_keys: set[str], known_questions: set[str]) -> bool:
    if candidate["factKey"] in known_keys:
        return False
    normalized_question = normalize(candidate["question"])
    if normalized_question in known_questions or len(candidate["question"]) < 12:
        return False
    if len(candidate["options"]) != 4 or candidate["correctIndex"] not in (0, 1, 2, 3):
        return False
    return True


def obtain_batch(difficulty: str) -> list[dict[str, Any]]:
    response = requests.get(
        SOURCE_URL,
        params={"amount": 50, "difficulty": difficulty, "type": "multiple", "encode": "base64"},
        timeout=45,
    )
    response.raise_for_status()
    body = response.json()
    if body.get("response_code") != 0:
        raise ValueError(f"zdroj nevrátil otázky: {body.get('response_code')}")
    return body["results"]


def tier_counts(items: list[dict[str, Any]]) -> dict[str, int]:
    return {tier: sum(1 for item in items if item.get("difficulty") == tier) for tier in ("lahke", "tazke")}


def main() -> int:
    items: list[dict[str, Any]] = json.loads(OUT.read_text(encoding="utf-8"))
    known_keys = {item["factKey"] for item in items}
    known_questions = {normalize(item["question"]) for item in items}
    counters = tier_counts(items)
    tier_source_difficulties = {"lahke": ["easy"], "tazke": ["medium", "hard"]}

    for tier in ("lahke", "tazke"):
        source_index = 0
        attempts = 0
        while counters[tier] < TARGET:
            source_difficulty = tier_source_difficulties[tier][source_index % len(tier_source_difficulties[tier])]
            source_index += 1
            attempts += 1
            if attempts > 80:
                raise RuntimeError(f"Nepodarilo sa doplniť úroveň {tier} na {TARGET} otázok.")
            print(f"Záložný zdroj: {tier} {counters[tier]}/{TARGET}, dávka {attempts}", flush=True)
            try:
                raw_batch = obtain_batch(source_difficulty)
            except (requests.RequestException, ValueError) as error:
                print(f"Dávka zdroja zlyhala: {error}", flush=True)
                time.sleep(5)
                continue
            for raw in raw_batch:
                if counters[tier] >= TARGET:
                    break
                if raw.get("category") not in CATEGORY_MAP:
                    continue
                try:
                    candidate = translate_question(raw)
                except (requests.RequestException, ValueError, KeyError, IndexError, TypeError) as error:
                    print(f"Vynechaná otázka po preklade: {error}", flush=True)
                    continue
                if not validate(candidate, known_keys, known_questions):
                    continue
                candidate["id"] = f"quiz-ext-{len(items) + 1:04d}"
                candidate["difficulty"] = tier
                candidate["answer"] = candidate["options"][candidate["correctIndex"]]
                items.append(candidate)
                known_keys.add(candidate["factKey"])
                known_questions.add(normalize(candidate["question"]))
                counters[tier] += 1
                OUT.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                print(f"Pridaná otázka: {tier} {counters[tier]}/{TARGET}", flush=True)
    print(f"Hotovo: {tier_counts(items)}; spolu {len(items)} otázok.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
