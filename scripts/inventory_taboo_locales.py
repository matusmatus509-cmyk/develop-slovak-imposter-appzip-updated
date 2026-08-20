import json
from collections import defaultdict
from pathlib import Path

ROOT = Path('/home/ubuntu/slovak-imposter-games')
DATA = ROOT / 'client/src/data'
LOCALES = ('en', 'de', 'es', 'fr', 'pt')
files_by_category = defaultdict(dict)

for path in sorted((DATA / 'taboo-locales').glob('*.json')):
    data = json.loads(path.read_text())
    files_by_category[data['category']][data['locale']] = {
        'path': str(path.relative_to(ROOT)),
        'cards': len(data.get('cards', [])),
    }

report = []
for category, files in sorted(files_by_category.items()):
    present = tuple(sorted(files))
    complete = all(locale in files and files[locale]['cards'] == 150 for locale in LOCALES)
    report.append({
        'category': category,
        'complete': complete,
        'present_locales': present,
        'missing_locales': tuple(locale for locale in LOCALES if locale not in files),
        'files': files,
    })

print(json.dumps({'categories': report}, ensure_ascii=False, indent=2))
