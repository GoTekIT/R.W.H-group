from hashlib import sha256
from pathlib import Path
import re

root = Path(__file__).resolve().parent
index = root / 'dist' / 'index.html'
html = index.read_text()
for name in ['styles.css', 'projects.js', 'i18n.js', 'project-details.js', 'app.js']:
    version = sha256((root / 'dist' / name).read_bytes()).hexdigest()[:10]
    pattern = r'\./' + re.escape(name) + r'(?:\?v=[^"\s]+)?'
    html = re.sub(pattern, f'./{name}?v={version}', html)
index.write_text(html)
print('Runtime asset URLs refreshed.')
