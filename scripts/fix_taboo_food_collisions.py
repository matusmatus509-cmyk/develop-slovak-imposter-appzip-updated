import json
from pathlib import Path

ROOT = Path('/home/ubuntu/slovak-imposter-games')
DATA = ROOT / 'client/src/data/taboo-locales'

PATCHES = {
    'de': {
        'taboo_sk_0578': {'word': 'Backvorgang'},
        'taboo_sk_0698': {'word': 'Hörnchen'},
        'taboo_sk_0826': {'forbidden': ['Weihnachten', 'Zopf', 'Hefe', 'Rosinen']},
        'taboo_sk_0828': {'forbidden': ['Ringform', 'Kuchenform', 'Hefe', 'Puderzucker']},
        'taboo_sk_0829': {'forbidden': ['Mohn', 'Samen', 'Füllung', 'Streusel']},
    },
    'en': {
        'taboo_sk_0561': {'word': 'birthday cake'},
        'taboo_sk_0826': {'forbidden': ['yeast', 'holiday', 'braided', 'sweet']},
        'taboo_sk_0828': {'forbidden': ['ring', 'mold', 'glaze', 'marble']},
        'taboo_sk_0829': {'forbidden': ['seeds', 'filling', 'lemon', 'slice']},
    },
    'es': {
        'taboo_sk_0432': {'word': 'salsa picante'},
        'taboo_sk_0698': {'word': 'bollo de media luna'},
        'taboo_sk_0410': {'forbidden': ['mayonesa', 'yogur', 'cremoso', 'ensalada']},
        'taboo_sk_0828': {'forbidden': ['molde', 'esponjoso', 'vainilla', 'horno']},
        'taboo_sk_0829': {'forbidden': ['semillas', 'repostería', 'relleno', 'dulce']},
    },
    'fr': {
        'taboo_sk_0561': {'word': "gâteau d'anniversaire"},
        'taboo_sk_0410': {'word': 'sauce salade'},
        'taboo_sk_0698': {'word': 'petit pain allongé'},
        'taboo_sk_0826': {'forbidden': ['Noël', 'tressé', 'levure', 'sucré']},
        'taboo_sk_0828': {'forbidden': ['moule', 'anneau', 'glaçage', 'marbré']},
        'taboo_sk_0829': {'forbidden': ['graines', 'garniture', 'citron', 'tranche']},
    },
    'pt': {
        'taboo_sk_0561': {'word': 'bolo de aniversário'},
        'taboo_sk_0580': {'word': 'mistura'},
        'taboo_sk_0578': {'word': 'cozedura'},
        'taboo_sk_0410': {'word': 'molho para salada'},
        'taboo_sk_0698': {'word': 'pão em meia-lua'},
        'taboo_sk_0826': {'forbidden': ['Natal', 'trança', 'fermento', 'doce']},
        'taboo_sk_0828': {'forbidden': ['anel', 'forma', 'cobertura', 'massa']},
        'taboo_sk_0829': {'forbidden': ['sementes', 'papoula', 'recheio', 'sobremesa']},
    },
}

for locale, patch_by_id in PATCHES.items():
    path = DATA / f'food.{locale}.json'
    payload = json.loads(path.read_text())
    cards = {card['id']: card for card in payload['cards']}
    missing = sorted(set(patch_by_id) - set(cards))
    if missing:
        raise RuntimeError(f'{locale}: missing IDs: {missing}')
    for card_id, changes in patch_by_id.items():
        cards[card_id].update(changes)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    print(f'{locale}: updated {len(patch_by_id)} cards')
