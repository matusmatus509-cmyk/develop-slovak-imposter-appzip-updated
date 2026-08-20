import json
import os
import re
import urllib.request
from pathlib import Path

ROOT = Path('/home/ubuntu/slovak-imposter-games')
DATA = ROOT / 'client/src/data'
OUT = DATA / 'taboo-locales'
OUT.mkdir(parents=True, exist_ok=True)
MASTER = json.loads((DATA / 'tabooCardsSk.json').read_text())
CATEGORY = os.environ.get('TABOO_CATEGORY')
if not CATEGORY:
    raise SystemExit('TABOO_CATEGORY is required')
slug = re.sub(r'[^a-z0-9]+', '-', CATEGORY.lower()).strip('-')
CARDS = [card for card in MASTER['cards'] if card['category'] == CATEGORY]
if len(CARDS) != 150:
    raise SystemExit(f'Expected 150 cards for {CATEGORY}, got {len(CARDS)}')
LANGUAGES = {'en': 'English', 'de': 'German', 'es': 'Spanish', 'fr': 'French', 'pt': 'Portuguese'}
schema = {'type':'object','properties':{'cards':{'type':'array','items':{'type':'object','properties':{'id':{'type':'string'},'category':{'type':'string'},'word':{'type':'string'},'forbidden':{'type':'array','items':{'type':'string'},'minItems':4,'maxItems':4}},'required':['id','category','word','forbidden'],'additionalProperties':False}}},'required':['cards'],'additionalProperties':False}

def request_translation(locale, language):
    prompt = {'task':'Translate one category of a party-game Taboo database.','target_language':language,'rules':['Return exactly one translated record for every input record.','Preserve every id exactly.','Preserve the category meaning as a natural translation of the same category.','Translate the target word and all four forbidden clues naturally for native speakers.','Keep exactly four concise forbidden words or short phrases per card.','Do not add cards, remove cards, reorder cards, or include commentary.','Use common, game-friendly vocabulary and correct grammar.'],'input_cards':CARDS}
    body = json.dumps({'model':'gpt-5-nano','messages':[{'role':'system','content':'You are a meticulous native translator and party-game editor. Output JSON only.'},{'role':'user','content':json.dumps(prompt,ensure_ascii=False)}],'max_completion_tokens':16000,'response_format':{'type':'json_schema','json_schema':{'name':'taboo_translation','strict':True,'schema':schema}}}).encode()
    req = urllib.request.Request(os.environ['OPENAI_API_BASE'].rstrip('/') + '/chat/completions', data=body, headers={'Authorization':'Bearer '+os.environ['OPENAI_API_KEY'],'Content-Type':'application/json'}, method='POST')
    last_error = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=360) as response: payload = json.loads(response.read())
            if not payload.get('choices'):
                raise RuntimeError(f'API response missing choices: {json.dumps(payload, ensure_ascii=False)[:500]}')
            break
        except Exception as exc:
            last_error = exc
            if attempt == 2: raise
    else:
        raise last_error
    result = json.loads(payload['choices'][0]['message']['content'])
    if len(result['cards']) != len(CARDS) or [c['id'] for c in result['cards']] != [c['id'] for c in CARDS]: raise ValueError(f'{locale}: ids/count/order mismatch')
    output = {'version':1,'locale':locale,'category':CATEGORY,'cards':result['cards']}
    (OUT / f'{slug}.{locale}.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    return locale, len(result['cards'])

requested = [x for x in os.environ.get('TABOO_LOCALES','en,de,es,fr,pt').split(',') if x]
for locale in requested:
    if locale not in LANGUAGES: raise SystemExit(f'Unsupported locale {locale}')
    path = OUT / f'{slug}.{locale}.json'
    if path.exists():
        print(f'{locale}: exists, skipped')
        continue
    locale, count = request_translation(locale, LANGUAGES[locale])
    print(f'{locale}: {count} cards written')
print(json.dumps({'category':CATEGORY,'slug':slug,'locale_files':{locale:(OUT/f'{slug}.{locale}.json').exists() for locale in LANGUAGES}},ensure_ascii=False))
