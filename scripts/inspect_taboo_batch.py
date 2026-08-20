import json
from pathlib import Path

root = Path('/home/ubuntu/slovak-imposter-games/client/src')
master = json.loads((root / 'data/tabooCardsSk.json').read_text())
cards = [card for card in master['cards'] if card['category'] == 'Jedlo a nápoje']
print(json.dumps({
    'master_locale': master['locale'],
    'category': 'Jedlo a nápoje',
    'count': len(cards),
    'first_ids': [card['id'] for card in cards[:5]],
    'last_ids': [card['id'] for card in cards[-5:]],
}, ensure_ascii=False, indent=2))
for path in sorted((root / 'data').glob('*taboo*')):
    print(path.name)
