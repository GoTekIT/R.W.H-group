"""Render the client-numbered Drive project set into the static website.

The optimized images are committed in dist/assets/rwh-projects. No Drive login
or document download is needed at build time or when someone views the site.
"""
from hashlib import sha256
from html import escape
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent
DIST = ROOT / 'dist'
projects = json.loads((ROOT / 'PROJECT_SOURCES.json').read_text())['projects']
assert [p['number'] for p in projects] == list(range(1, 11))


def e(text):
    return escape(str(text), quote=True)


def asset(name):
    return f'{name}?v={sha256((DIST / name).read_bytes()).hexdigest()[:10]}'


sections = []
for project in projects:
    number = project['number']
    sections.append(f'''    <section class="section sec{number:02d} mainImg" id="project-{number}">
        <div class="full"></div>
        <div class="bg pc" style="background-image: url(./{e(project['hero'])})"></div>
        <div class="bg sp" style="background-image: url(./{e(project['mobile'])})"></div>
        <div class="txtBox"><a href="./projects/{e(project['slug'])}/index.html" aria-label="Xem chi tiết {e(project['title'])}">
            <h2><span>{e(project['title'])}</span></h2>
            <p class="txt"><span class="shuffle">{e(project['category'])}{' / ' + e(project['location']) if project['location'] else ''}</span><br><span class="shuffle">{e(project['subtitle'])}</span></p>
            <div class="detail"><p class="txt01">DETAIL</p><p class="line"></p></div>
        </a></div>
    </section>''')

index = DIST / 'index.html'
html = index.read_text()
html, count = re.subn(r'    <section class="section sec01 mainImg".*?(?=    <section class="section [^"]*fp-auto-height)', '\n'.join(sections) + '\n', html, flags=re.S)
assert count == 1, 'Could not locate the landing-page project sections'
html = html.replace('<html lang="en">', '<html lang="vi">')
html = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="Các dự án RWH: nghỉ dưỡng, Onsen, chăm sóc sức khỏe, khách sạn và kiến trúc đô thị tại Việt Nam và Nhật Bản.">', html)
index.write_text(html)

for i, project in enumerate(projects):
    number = project['number']
    folder = DIST / 'projects' / project['slug']
    folder.mkdir(parents=True, exist_ok=True)
    facts = ''.join(f'<div><dt>{e(label)}</dt><dd>{e(value)}</dd></div>' for label, value in project['facts'])
    figures = []
    for j, photo in enumerate(project['images']):
        caption = f'{project["title"]} — {j + 1:02d}'
        figures.append(f'''<figure><a class="gallery-image" href="../../{e(photo['src'])}" data-caption="{e(caption)}" aria-label="Phóng to ảnh {j + 1} của {e(project['title'])}"><img src="../../{e(photo['src'])}" width="{photo['width']}" height="{photo['height']}" alt="{e(caption)}" loading="lazy" decoding="async"></a></figure>''')
    previous = projects[i - 1] if i else None
    following = projects[i + 1] if i + 1 < len(projects) else None
    previous_link = f'<a href="../{e(previous["slug"])}/index.html"><small>DỰ ÁN TRƯỚC</small>{e(previous["title"])}</a>' if previous else '<a href="../../index.html"><small>TRỞ VỀ</small>TRANG CHỦ</a>'
    next_link = f'<a href="../{e(following["slug"])}/index.html"><small>DỰ ÁN TIẾP THEO</small>{e(following["title"])}</a>' if following else '<a href="../../index.html"><small>TRỞ VỀ</small>TRANG CHỦ</a>'
    page = f'''<!doctype html>
<html lang="vi"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{e(project['title'])} | RWH</title>
<meta name="description" content="{e(project['description'])}">
<meta name="theme-color" content="#292929">
<link rel="icon" href="../../assets/rwh-reference-wordmark.svg" type="image/svg+xml">
<link rel="stylesheet" href="../../{asset('project-gallery.css')}">
<script src="../../{asset('project-gallery.js')}" defer></script>
</head><body>
<header class="project-header"><a class="project-brand" href="../../index.html" aria-label="RWH — Trang chủ"><img src="../../assets/rwh-reference-wordmark.svg" alt="RWH" width="150" height="40"></a><a class="back-link" href="../../index.html?project={number}"><span aria-hidden="true">←</span> TRỞ VỀ</a></header>
<main>
<section class="project-hero" aria-label="{e(project['title'])}"><img src="../../{e(project['hero'])}" alt="{e(project['title'])} — ảnh tổng quan" fetchpriority="high" width="2400" height="1350"></section>
<section class="project-intro"><div><p class="project-number">{number:02d} / {len(projects):02d}</p><h1>{e(project['title'])}</h1><p class="project-category">{e(project['category'])}</p><p class="project-description">{e(project['description'])}</p></div><dl>{facts}</dl></section>
<section class="project-gallery" aria-labelledby="gallery-title"><div class="gallery-heading"><h2 id="gallery-title">HÌNH ẢNH DỰ ÁN</h2><span>{len(project['images']):02d} ẢNH</span></div><div class="gallery-grid">{''.join(figures)}</div></section>
<nav class="project-pagination" aria-label="Điều hướng dự án">{previous_link}{next_link}</nav>
</main>
<footer><span>RWH Group</span><a href="tel:+84982132489">0982-132-489</a></footer>
<dialog class="image-viewer" aria-label="Xem ảnh dự án"><button type="button" class="viewer-close" aria-label="Đóng ảnh" autofocus>×</button><button type="button" class="viewer-prev" aria-label="Ảnh trước">←</button><div class="viewer-stage"><img alt=""><p class="viewer-caption" aria-live="polite"></p></div><button type="button" class="viewer-next" aria-label="Ảnh tiếp theo">→</button></dialog>
</body></html>
'''
    (folder / 'index.html').write_text(page)

print(f'Rendered {len(projects)} ordered project sections and local detail galleries.')
