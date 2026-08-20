import json
from pathlib import Path

root = Path('/home/ubuntu/slovak-imposter-games/client/src/data/taboo-locales')
fixes = {
    'en': {
        'taboo_sk_0410': ['dressing', ['salad', 'mayonnaise', 'herb', 'vinegar']],
        'taboo_sk_0421': ['popsicle', ['stick', 'frozen', 'summer', 'dessert']],
        'taboo_sk_0683': ['toast', ['to toast', 'butter', 'breakfast', 'bread']],
    },
    'de': {
        'taboo_sk_0421': ['Eis am Stiel', ['Stiel', 'gefroren', 'Sommer', 'Dessert']],
    },
    'pt': {
        'taboo_sk_0391': ['cereais', ['pequeno-almoço', 'muesli', 'granola', 'leite']],
        'taboo_sk_0573': ['noz', ['casca', 'descascar', 'bolo', 'crocante']],
        'taboo_sk_0683': ['torrada', ['torrar', 'manteiga', 'café da manhã', 'pão']],
        'taboo_sk_0684': ['champignon', ['fungo', 'fritar', 'molho', 'cogumelo']],
    },
}
for locale, locale_fixes in fixes.items():
    path = root / f'food.{locale}.json'
    data = json.loads(path.read_text())
    by_id = {card['id']: card for card in data['cards']}
    for card_id, (word, forbidden) in locale_fixes.items():
        by_id[card_id]['word'] = word
        by_id[card_id]['forbidden'] = forbidden
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(locale, len(locale_fixes), 'cards corrected')
