"""Create a public article index from the Pages CMS JSON files."""
import json
from pathlib import Path
root = Path(__file__).parent
posts = []
for file in sorted((root / 'content' / 'posts').glob('*.json')):
    data = json.loads(file.read_text(encoding='utf-8'))
    if not isinstance(data, dict):
        continue
    data['id'] = file.stem
    if isinstance(data.get('date'), dict):
        data['date'] = str(data['date'].get('date', ''))
    posts.append(data)
(root / 'posts.json').write_text(json.dumps(posts, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Built {len(posts)} journal entries')
