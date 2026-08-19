import json
import re
from pathlib import Path

ROOT = Path('/home/ubuntu/slovak-imposter-games/client/src/data')
MASTER = json.loads((ROOT / 'tabooCardsSk.json').read_text())
source = [card for card in MASTER['cards'] if card['category'] == 'Jedlo a nápoje']
source_ids = [card['id'] for card in source]
results = {}
for locale in ['en', 'de', 'es', 'fr', 'pt']:
    path = ROOT / 'taboo-locales' / f'food.{locale}.json'
    data = json.loads(path.read_text())
    cards = data['cards']
    ids = [card['id'] for card in cards]
    errors = []
    if data.get('locale') != locale:
        errors.append('locale')
    if len(cards) != len(source):
        errors.append(f'count={len(cards)}')
    if ids != source_ids:
        errors.append('ids/order')
    categories = {card.get('category') for card in cards}
    if len(categories) != 1:
        errors.append('category-inconsistent')
    for card in cards:
        word = card.get('word', '').strip()
        forbidden = card.get('forbidden')
        if not word or not isinstance(forbidden, list) or len(forbidden) != 4 or any(not str(item).strip() for item in forbidden):
            errors.append(f'malformed:{card.get("id")}')
            continue
        normalized_word = re.sub(r'\W+', '', word.casefold(), flags=re.UNICODE)
        normalized_forbidden = [re.sub(r'\W+', '', str(item).casefold(), flags=re.UNICODE) for item in forbidden]
        if len(set(normalized_forbidden)) != 4:
            errors.append(f'duplicate-forbidden:{card["id"]}')
        if normalized_word in normalized_forbidden:
            errors.append(f'target-in-forbidden:{card["id"]}')
    results[locale] = {'count': len(cards), 'category': next(iter(categories), ''), 'errors': errors}
print(json.dumps({'source_count': len(source), 'locales': results, 'valid': all(not item['errors'] for item in results.values())}, ensure_ascii=False, indent=2))
if not all(not item['errors'] for item in results.values()):
    raise SystemExit(1)
