import json
import os
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path('/home/ubuntu/slovak-imposter-games')
DATA = ROOT / 'client/src/data'
OUT = DATA / 'taboo-locales'
OUT.mkdir(parents=True, exist_ok=True)
MASTER = json.loads((DATA / 'tabooCardsSk.json').read_text())
CATEGORY = 'Jedlo a nápoje'
CARDS = [card for card in MASTER['cards'] if card['category'] == CATEGORY]
LANGUAGES = {'en': 'English', 'de': 'German', 'es': 'Spanish', 'fr': 'French', 'pt': 'Portuguese'}

schema = {
    'type': 'object',
    'properties': {
        'cards': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'string'},
                    'category': {'type': 'string'},
                    'word': {'type': 'string'},
                    'forbidden': {'type': 'array', 'items': {'type': 'string'}, 'minItems': 4, 'maxItems': 4},
                },
                'required': ['id', 'category', 'word', 'forbidden'],
                'additionalProperties': False,
            },
        }
    },
    'required': ['cards'],
    'additionalProperties': False,
}


def request_translation(locale, language):
    prompt = {
        'task': 'Translate one category of a party-game Taboo database.',
        'target_language': language,
        'rules': [
            'Return exactly one translated record for every input record.',
            'Preserve every id exactly.',
            'Preserve the category meaning as a natural translation of the same category.',
            'Translate the target word and all four forbidden clues naturally for native speakers.',
            'Keep exactly four concise forbidden words or short phrases per card.',
            'Do not add cards, remove cards, reorder cards, or include commentary.',
            'Use common, game-friendly vocabulary and correct grammar.',
        ],
        'input_cards': CARDS,
    }
    body = json.dumps({
        'model': 'gpt-5-mini',
        'messages': [
            {'role': 'system', 'content': 'You are a meticulous native translator and party-game editor. Output JSON only.'},
            {'role': 'user', 'content': json.dumps(prompt, ensure_ascii=False)},
        ],
        'max_completion_tokens': 24000,
        'response_format': {'type': 'json_schema', 'json_schema': {'name': 'taboo_translation', 'strict': True, 'schema': schema}},
    }).encode()
    req = urllib.request.Request(
        os.environ['OPENAI_API_BASE'].rstrip('/') + '/chat/completions',
        data=body,
        headers={'Authorization': 'Bearer ' + os.environ['OPENAI_API_KEY'], 'Content-Type': 'application/json'},
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=240) as response:
        payload = json.loads(response.read())
    content = payload['choices'][0]['message']['content']
    result = json.loads(content)
    output = {'version': 1, 'locale': locale, 'category': CATEGORY, 'cards': result['cards']}
    (OUT / f'food.{locale}.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
    return locale, output


results = {}
requested = os.environ.get('TABOO_LOCALES')
pending = {locale: language for locale, language in LANGUAGES.items() if not (OUT / f'food.{locale}.json').exists() and (not requested or locale in requested.split(','))}
with ThreadPoolExecutor(max_workers=1) as pool:
    futures = {pool.submit(request_translation, locale, language): (locale, language) for locale, language in pending.items()}
    for future in as_completed(futures):
        locale, output = future.result()
        results[locale] = output
        print(f'{locale}: {len(output["cards"])} cards written')

print(json.dumps({'category': CATEGORY, 'translated_cards_by_locale': {locale: len(data['cards']) for locale, data in sorted(results.items())}}, ensure_ascii=False))
