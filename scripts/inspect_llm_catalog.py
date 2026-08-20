import json
import os
import urllib.request
req = urllib.request.Request(os.environ['OPENAI_API_BASE'].rstrip('/') + '/models', headers={'Authorization': 'Bearer ' + os.environ['OPENAI_API_KEY']})
with urllib.request.urlopen(req, timeout=20) as response:
    data = json.load(response)
for model in data.get('data', []):
    if model.get('id') in {'gpt-5-nano','gpt-5-mini','gemini-3-flash-preview'}:
        print(json.dumps({'id': model.get('id'), 'pricing': model.get('pricing'), 'capabilities': model.get('capabilities')}, ensure_ascii=False))
