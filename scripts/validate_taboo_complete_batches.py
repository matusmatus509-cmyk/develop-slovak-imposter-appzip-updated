import json
from collections import Counter
from pathlib import Path

ROOT = Path('/home/ubuntu/slovak-imposter-games')
DATA = ROOT / 'client/src/data'
MASTER = json.loads((DATA / 'tabooCardsSk.json').read_text())
LOCALES = ('en', 'de', 'es', 'fr', 'pt')
COMPLETE_CATEGORIES = ('Jedlo a nápoje', 'Zvieratá', 'Miesta a cestovanie', 'Ľudia a povolania')

master_by_category = {
    category: [card for card in MASTER['cards'] if card['category'] == category]
    for category in COMPLETE_CATEGORIES
}
errors = []
summary = []

for category, master_cards in master_by_category.items():
    matching_files = []
    for path in (DATA / 'taboo-locales').glob('*.json'):
        data = json.loads(path.read_text())
        if data.get('category') == category:
            matching_files.append((path, data))
    by_locale = {data['locale']: (path, data) for path, data in matching_files}
    for locale in LOCALES:
        if locale not in by_locale:
            errors.append(f'{category}/{locale}: missing file')
            continue
        path, data = by_locale[locale]
        cards = data.get('cards', [])
        expected_ids = [card['id'] for card in master_cards]
        actual_ids = [card.get('id') for card in cards]
        if len(cards) != 150:
            errors.append(f'{category}/{locale}: expected 150 cards, got {len(cards)}')
        if actual_ids != expected_ids:
            errors.append(f'{category}/{locale}: ID order does not match master')
        words = []
        forbidden_sets = []
        for index, card in enumerate(cards):
            word = card.get('word')
            forbidden = card.get('forbidden')
            if not isinstance(word, str) or not word.strip():
                errors.append(f'{category}/{locale}/{index}: empty target word')
            if not isinstance(forbidden, list) or len(forbidden) != 4:
                errors.append(f'{category}/{locale}/{index}: expected exactly 4 forbidden words')
                continue
            normalized = [item.strip().casefold() for item in forbidden if isinstance(item, str) and item.strip()]
            if len(normalized) != 4:
                errors.append(f'{category}/{locale}/{index}: empty forbidden word')
            if len(set(normalized)) != 4:
                errors.append(f'{category}/{locale}/{index}: duplicate forbidden word')
            if word and word.strip().casefold() in normalized:
                errors.append(f'{category}/{locale}/{index}: target word repeated among forbidden words')
            words.append(word.strip().casefold() if isinstance(word, str) else '')
            forbidden_sets.append(tuple(sorted(normalized)))
        duplicated_words = [word for word, count in Counter(words).items() if word and count > 1]
        duplicated_sets = [terms for terms, count in Counter(forbidden_sets).items() if terms and count > 1]
        if duplicated_words:
            errors.append(f'{category}/{locale}: duplicate target words: {duplicated_words[:8]}')
        if duplicated_sets:
            errors.append(f'{category}/{locale}: duplicate forbidden combinations: {duplicated_sets[:3]}')
    summary.append({'category': category, 'locales_checked': sorted(by_locale), 'master_cards': len(master_cards)})

report = {'valid': not errors, 'summary': summary, 'error_count': len(errors), 'errors': errors}
(ROOT / 'taboo-complete-batches-validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
if errors:
    raise SystemExit(1)
