import json
import re
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "src" / "data" / "quiz-master.raw.json"
items = json.loads(path.read_text(encoding="utf-8"))
url_encoded = []
english_starts = []
english_pattern = re.compile(r"^(Which|What|Who|Where|When|Why|How|In\s+which|The\s+)", re.I)
for item in items:
    text = " ".join([item["question"], *item["options"]])
    if re.search(r"%[0-9A-Fa-f]{2}", text):
        url_encoded.append(item["id"])
    if english_pattern.search(item["question"]):
        english_starts.append(item["id"])
print(json.dumps({
    "total": len(items),
    "urlEncodedText": len(url_encoded),
    "urlEncodedSamples": url_encoded[:10],
    "englishQuestionStarts": len(english_starts),
    "englishQuestionSamples": english_starts[:10],
}, ensure_ascii=False, indent=2))
if url_encoded or english_starts:
    raise SystemExit(1)
