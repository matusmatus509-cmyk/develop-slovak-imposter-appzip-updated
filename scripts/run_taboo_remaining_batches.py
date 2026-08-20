import os
import subprocess
from pathlib import Path

root = Path('/home/ubuntu/slovak-imposter-games')
categories = [
    'Miesta a cestovanie',
    'Ľudia a povolania',
    'Predmety a domácnosť',
    'Aktivity a šport',
    'Filmy, seriály a kultúra',
    'Technológie a médiá',
    'Príroda a svet',
    'Všeobecné pojmy a situácie',
]
for category in categories:
    print(f'=== {category} ===', flush=True)
    env = os.environ.copy()
    env['TABOO_CATEGORY'] = category
    result = subprocess.run(['python3', 'scripts/translate_taboo_category_batch.py'], cwd=root, env=env)
    if result.returncode:
        raise SystemExit(f'Category failed: {category} ({result.returncode})')
    print(f'=== completed {category} ===', flush=True)
