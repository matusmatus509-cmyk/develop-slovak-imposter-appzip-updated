import json
from collections import defaultdict
from pathlib import Path

ROOT = Path('/home/ubuntu/slovak-imposter-games')
DATA = ROOT / 'client/src/data'
MASTER = json.loads((DATA / 'tabooCardsSk.json').read_text())['cards']
master_by_id = {card['id']: card for card in MASTER}
LOCALES = ('en', 'de', 'es', 'fr', 'pt')
CATEGORIES = {'Jedlo a nápoje', 'Zvieratá', 'Miesta a cestovanie', 'Ľudia a povolania'}

for path in sorted((DATA / 'taboo-locales').glob('*.json')):
    data = json.loads(path.read_text())
    category = data.get('category')
    locale = data.get('locale')
    if category not in CATEGORIES or locale not in LOCALES:
        continue
    cards = data['cards']
    by_word = defaultdict(list)
    for index, card in enumerate(cards):
        by_word[card['word'].strip().casefold()].append((index, card))
    collisions = []
    for word, rows in by_word.items():
        if len(rows) > 1:
            collisions.append({
                'type': 'duplicate_target',
                'word': word,
                'cards': [
                    {
                        'index': index,
                        'id': card['id'],
                        'sk_word': master_by_id[card['id']]['word'],
                        'translated_word': card['word'],
                        'forbidden': card['forbidden'],
                    }
                    for index, card in rows
                ],
            })
    for index, card in enumerate(cards):
        normalized_word = card['word'].strip().casefold()
        normalized_forbidden = [term.strip().casefold() for term in card['forbidden']]
        if normalized_word in normalized_forbidden or len(set(normalized_forbidden)) != 4:
            collisions.append({
                'type': 'invalid_forbidden',
                'index': index,
                'id': card['id'],
                'sk_word': master_by_id[card['id']]['word'],
                'translated_word': card['word'],
                'forbidden': card['forbidden'],
            })
    if collisions:
        print(json.dumps({'category': category, 'locale': locale, 'issues': collisions}, ensure_ascii=False, indent=2))
