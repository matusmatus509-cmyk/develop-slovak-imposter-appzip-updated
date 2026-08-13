#!/usr/bin/env python3
"""Doplní kvíz z alternatívneho verejného zdroja s prekladom do slovenčiny."""

from __future__ import annotations

import hashlib
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
TRIVIA_URL = "https://the-trivia-api.com/v2/questions"
TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"

CATEGORY_MAP = {
    "geography": "🌍 Geografia",
    "history": "📜 História",
    "arts_and_literature": "🎨 Umenie a knihy",
    "film_and_tv": "🎬 Filmy a seriály",
    "music": "🎵 Hudba",
    "sport_and_leisure": "🏆 Šport",
    "science": "🔬 Veda",
    "technology": "💡 Technológie",
    "food_and_drink": "🍝 Jedlo a život",
    "society_and_culture": "🎨 Umenie a knihy",
}


def normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")


def translate_lines(lines: list[str]) -> list[str]:
    response = requests.get(
        TRANSLATE_URL,
        params={"client": "gtx", "sl": "en", "tl": "sk", "dt": "t", "q": "\n".join(lines)},
        timeout=30,
    )
    response.raise_for_status()
    translated = "".join(part[0] for part in response.json()[0])
    output = [line.strip() for line in translated.splitlines()]
    if len(output) != len(lines):
        raise ValueError("preklad nezachoval počet riadkov")
    return output


def translate_question(raw: dict[str, Any]) -> dict[str, Any]:
    question = str(raw["question"]["text"]).strip()
    correct = str(raw["correctAnswer"]).strip()
    incorrect = [str(value).strip() for value in raw["incorrectAnswers"]]
    sk_question, sk_correct, *sk_incorrect = translate_lines([question, correct, *incorrect])
    options = [sk_correct, *sk_incorrect]
    if len(options) != 4 or len({normalize(option) for option in options}) != 4:
        raise ValueError("preložené možnosti nie sú štyri jedinečné položky")
    random.shuffle(options)
    return {
        "factKey": "triviaapi_" + hashlib.sha1(raw["id"].encode("utf-8")).hexdigest()[:16],
        "question": sk_question if sk_question.endswith("?") else sk_question + "?",
        "options": options,
        "correctIndex": options.index(sk_correct),
        "category": CATEGORY_MAP.get(str(raw.get("category")), "💡 Technológie"),
    }


def counts(items: list[dict[str, Any]]) -> dict[str, int]:
    return {tier: sum(1 for item in items if item.get("difficulty") == tier) for tier in ("lahke", "tazke")}


def main() -> int:
    items: list[dict[str, Any]] = json.loads(OUT.read_text(encoding="utf-8"))
    keys = {item["factKey"] for item in items}
    questions = {normalize(item["question"]) for item in items}
    current = counts(items)
    source_difficulties = {"lahke": "easy", "tazke": "hard"}

    for tier in ("lahke", "tazke"):
        failures = 0
        while current[tier] < TARGET:
            print(f"Alternatívny zdroj: {tier} {current[tier]}/{TARGET}", flush=True)
            try:
                response = requests.get(TRIVIA_URL, params={"limit": 50, "difficulties": source_difficulties[tier]}, timeout=45)
                response.raise_for_status()
                batch = response.json()
                if not isinstance(batch, list):
                    raise ValueError("zdroj nevrátil zoznam")
            except (requests.RequestException, ValueError) as error:
                failures += 1
                if failures >= 20:
                    raise RuntimeError(f"Alternatívny zdroj je nedostupný: {error}")
                time.sleep(10)
                continue
            failures = 0
            for raw in batch:
                if current[tier] >= TARGET:
                    break
                if raw.get("type") != "text_choice" or raw.get("category") not in CATEGORY_MAP:
                    continue
                try:
                    candidate = translate_question(raw)
                except (requests.RequestException, ValueError, KeyError, IndexError, TypeError) as error:
                    print(f"Vynechaná otázka: {error}", flush=True)
                    continue
                question_key = normalize(candidate["question"])
                if candidate["factKey"] in keys or question_key in questions or len(candidate["question"]) < 12:
                    continue
                candidate["id"] = f"quiz-alt-{len(items) + 1:04d}"
                candidate["difficulty"] = tier
                candidate["answer"] = candidate["options"][candidate["correctIndex"]]
                items.append(candidate)
                keys.add(candidate["factKey"])
                questions.add(question_key)
                current[tier] += 1
                OUT.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                print(f"Pridaná otázka: {tier} {current[tier]}/{TARGET}", flush=True)
            time.sleep(5)
    print(f"Hotovo: {counts(items)}; spolu {len(items)} otázok.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
