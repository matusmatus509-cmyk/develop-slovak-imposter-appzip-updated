import json
from collections import defaultdict
from pathlib import Path

ROOT = Path('/home/ubuntu/slovak-imposter-games')
DATA = ROOT / 'client/src/data/taboo-locales'

for path in sorted(DATA.glob('food.*.json')):
    data = json.loads(path.read_text())
    duplicates = defaultdict(list)
    for index, card in enumerate(data['cards']):
        key = tuple(sorted(term.strip().casefold() for term in card['forbidden']))
        duplicates[key].append((index, card))
    matches = [
        {
            'forbidden': list(key),
            'cards': [
                {'index': index, 'id': card['id'], 'word': card['word'], 'forbidden': card['forbidden']}
                for index, card in rows
            ],
        }
        for key, rows in duplicates.items()
        if len(rows) > 1
    ]
    if matches:
        print(json.dumps({'locale': data['locale'], 'duplicates': matches}, ensure_ascii=False, indent=2))
