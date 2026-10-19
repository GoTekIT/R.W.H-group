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


# Detail pages use the reference's shared, works and detail styles together.
fonts = '''@charset "utf-8";
@font-face{font-family:Roboto;font-weight:300;font-display:swap;src:url('./assets/roboto-light.ttf') format('truetype')}
@font-face{font-family:Roboto;font-weight:400;font-display:swap;src:url('./assets/roboto-regular.ttf') format('truetype')}
@font-face{font-family:Roboto;font-weight:500;font-display:swap;src:url('./assets/roboto-medium.ttf') format('truetype')}
'''
reference_styles = []
for name in ['common.css', 'works.css', 'works_detail.css']:
    source = (ROOT / 'reference' / name).read_text()
    source = source.replace('@charset "utf-8";', '')
    source = source.replace("url('/img/", "url('https://apollo-aa.jp/img/")
    source = '\n'.join(line.rstrip() for line in source.splitlines()) + '\n'
    reference_styles.append(source)
contact_css = (DIST / 'styles.css').read_text().split('.contact-modal {', 1)[1]
contact_css = '.contact-modal {' + contact_css
(DIST / 'project-gallery.css').write_text(fonts + '\n'.join(reference_styles) + '\n' + contact_css + '\n' + (DIST / 'project-detail-overrides.css').read_text())


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

# Reuse the approved homepage menu, footer and owner contact form.
def detail_links(markup):
    markup = markup.replace('href="./', 'href="../../').replace('src="./', 'src="../../')
    markup = markup.replace('href="https://apollo-aa.jp/works"', 'href="../../index.html"')
    markup = markup.replace('href="https://apollo-aa.jp/archi_worksprojects/projects"', 'href="../../index.html"')
    return markup


navigation = detail_links(re.search(r'<nav class="menuBox".*?</nav>', html, re.S).group())
footer = detail_links(re.search(r'<footer id="gFooter">.*?</footer>', html, re.S).group())
footer = footer.replace('href="#container"', 'href="../../index.html"')
footer = footer.replace('<div class="fInner">', '<div class="fInner"><div class="pagetop"><a href="#container" aria-label="Về đầu dự án"><img src="../../assets/apollo-reference/132dcb5de486.png" alt="" width="15"></a></div>', 1)
contact_dialog = re.search(r'<dialog class="contact-modal".*?</dialog>', html, re.S).group()

for i, project in enumerate(projects):
    number = project['number']
    folder = DIST / 'projects' / project['slug']
    folder.mkdir(parents=True, exist_ok=True)
    facts = ''.join(f'<tr><th scope="row">{e(label)}</th><td>{e(value)}</td></tr>' for label, value in project['facts'])
    figures = []
    for j, photo in enumerate(project['images']):
        caption = f'{project["title"]} — {j + 1:02d}'
        source = project['hero'] if j == 0 else photo['src']
        loading = 'loading="eager" fetchpriority="high"' if j == 0 else 'loading="lazy"'
        figures.append(f'''<div class="photo"><a class="gallery-image" href="../../{e(source)}" data-caption="{e(caption)}" aria-label="Phóng to ảnh {j + 1} của {e(project['title'])}"><img src="../../{e(source)}" width="{photo['width']}" height="{photo['height']}" alt="{e(caption)}" {loading} decoding="async"></a></div>''')
    related = []
    for offset in range(1, 4):
        item = projects[(i + offset) % len(projects)]
        related.append(f'''<li><a href="../{e(item['slug'])}/index.html"><span class="over"><span class="pho"><img src="../../{e(item['images'][0]['thumbnail'])}" alt="{e(item['title'])}" loading="lazy"></span></span><span class="txt margin"><span class="ttl">{e(item['title'])}</span><span class="txt01">{e(item['category'])}<br>{e(item['subtitle'])}</span></span></a></li>''')
    page = f'''<!doctype html>
<html lang="vi"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{e(project['title'])} | RWH</title>
<meta name="description" content="{e(project['description'])}">
<meta name="theme-color" content="#292929">
<link rel="icon" href="../../assets/rwh-reference-wordmark.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&amp;family=Roboto:wght@300;400;500&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../{asset('project-gallery.css')}">
<script src="../../{asset('project-gallery.js')}" defer></script>
<script src="../../{asset('contact-form.js')}" defer></script>
</head><body>
<div id="container">
<header id="gHeader" class="header01"><div class="inner"><h1><a class="hLogo" href="../../index.html" aria-label="RWH — Trang chủ"><img class="pc" src="../../assets/rwh-reference-wordmark.svg" alt="RWH" width="357"><img class="sp" src="../../assets/rwh-reference-wordmark.svg" alt="RWH" width="255"></a></h1></div></header>
<div class="meunRBox"><button class="menu" type="button" aria-label="Open menu" aria-controls="navigation" aria-expanded="false"><span class="top"></span><span class="bottom"></span></button></div>
{navigation}
<main id="main" tabindex="-1">
<div class="comTopLinkBox"><h2>{e(project['title'])}</h2><div class="rBox"><p class="txt">{e(project['category'])}{' / ' + e(project['location']) if project['location'] else ''}<br>{e(project['subtitle'])}</p></div></div>
<div class="comSideTxt"><p class="txt"><span class="txt01"><a href="../../index.html?project={number}">WORKS</a></span><span class="txt02" title="{e(project['title'])}">{e(project['title'])}</span></p></div>
<section class="sec01" aria-label="{e(project['title'])}"><div class="inner01">
<div class="project-photos">{''.join(figures)}</div>
<div class="textArea"><div class="bdBox"><div class="lBox"><p class="project-description">{e(project['description'])}</p></div></div></div>
<div class="txtBox"><div class="tBox"><h2>DATA</h2></div><div class="rBox"><ul class="txtListUl"><li><table><tbody>{facts}</tbody></table></li></ul></div></div>
</div></section>
<section class="sec02"><div class="inner"><h2 class="h2Ttl">OTHER WORKS</h2><ul class="listUl listUl01">{''.join(related)}</ul><div class="comBtn"><a href="../../index.html"><span class="en">MORE</span></a></div></div></section>
</main>
{footer}
</div>
{contact_dialog}
<dialog class="image-viewer" aria-label="Xem ảnh dự án"><button type="button" class="viewer-close" aria-label="Đóng ảnh" autofocus>×</button><button type="button" class="viewer-prev" aria-label="Ảnh trước">←</button><div class="viewer-stage"><img alt=""><p class="viewer-caption" aria-live="polite"></p></div><button type="button" class="viewer-next" aria-label="Ảnh tiếp theo">→</button></dialog>
</body></html>
'''
    (folder / 'index.html').write_text(page)

print(f'Rendered {len(projects)} ordered project sections and local detail galleries.')
