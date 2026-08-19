import json
from pathlib import Path
root = Path('/home/ubuntu/slovak-imposter-games/client/src/data/taboo-locales')
for locale, ids in {'en':['taboo_sk_0410','taboo_sk_0421','taboo_sk_0683'],'de':['taboo_sk_0421'],'pt':['taboo_sk_0391','taboo_sk_0573','taboo_sk_0683','taboo_sk_0684']}.items():
    data = json.loads((root / f'food.{locale}.json').read_text())
    print(locale)
    for card in data['cards']:
        if card['id'] in ids:
            print(card)
