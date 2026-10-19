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
translations = json.loads((ROOT / 'PROJECT_TRANSLATIONS.json').read_text())
video_sources = json.loads((ROOT / 'VIDEO_SOURCES.json').read_text())
videos = {video['id']: video for video in video_sources['videos']}
assert [p['number'] for p in projects] == list(range(1, 11))


def e(text):
    return escape(str(text), quote=True)


def asset(name):
    return f'{name}?v={sha256((DIST / name).read_bytes()).hexdigest()[:10]}'


def video_card(video, prefix='./'):
    source = video.get('embed', prefix + video['source'])
    poster = prefix + video['poster']
    notes = {'brandFilm': 'Phim giới thiệu chung của R.W.H Group.', 'projectFilm': 'Phim giới thiệu dự án.', 'referenceFilm': 'Video tham khảo · withBanyan. Không thuộc danh mục dự án R.W.H Group.'}
    if video['kind'] == 'mp4':
        media = f'<video data-inline-video controls muted playsinline preload="none" poster="{e(poster)}" src="{e(source)}" aria-label="{e(video["title"])}"></video>'
    else:
        media = f'<iframe data-video-embed="{e(source)}" title="{e(video["title"])}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>'
    return f'''<article class="video-card"><div class="video-stage" data-video-stage data-video-kind="{e(video['kind'])}">{media}</div><h3>{e(video['title'])}</h3><p data-i18n="{video['noteKey']}">{notes[video['noteKey']]}</p></article>'''


def video_library(prefix='./'):
    return f'''<dialog class="video-library" id="video-library" aria-labelledby="video-library-title"><div class="video-library-head"><h2 id="video-library-title" data-i18n="videos">VIDEO</h2><button class="video-library-close" type="button" data-videos-close aria-label="Đóng video" data-i18n-aria-label="closeVideos" autofocus><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div class="video-library-body"><p class="video-library-intro" data-i18n="videosIntro">Những thước phim về kiến trúc, Onsen và không gian chăm sóc sức khỏe.</p><div class="video-library-grid">{''.join(video_card(video, prefix) for video in videos.values())}</div></div></dialog>'''


copy = {'vi': {}, 'en': {}}
for project in projects:
    translated = translations[project['slug']]
    assert len(project['facts']) == len(translated['en']['facts'])
    for lang in ['vi', 'en']:
        values = dict(project) if lang == 'vi' else translated['en']
        if lang == 'vi':
            values['category'] = translated['categoryVi']
        key = f'project.{project["slug"]}'
        copy[lang][key + '.metadata'] = values['category'] + (' / ' + values['location'] if values['location'] else '')
        for field in ['category', 'subtitle', 'description']:
            copy[lang][key + '.' + field] = values[field]
        for row, (label, value) in enumerate(values['facts']):
            copy[lang][f'{key}.fact.{row}.label'] = label
            copy[lang][f'{key}.fact.{row}.value'] = value
(DIST / 'project-copy.js').write_text('window.RWHProjectCopy = ' + json.dumps(copy, ensure_ascii=False, separators=(',', ':')) + ';\n')


switcher = '''<div class="language-switch" role="group" aria-label="Ngôn ngữ" data-i18n-aria-label="language"><button type="button" data-language="vi" lang="vi" aria-label="Tiếng Việt" aria-pressed="true">VI</button><button type="button" data-language="en" lang="en" aria-label="English" aria-pressed="false">EN</button></div>'''


def localize_ui(markup):
    labels = {
        'WORKS': 'works', 'PROJECTS': 'projects', 'MOVIES': 'movies', 'NEWS': 'news', 'PROFILE': 'profile',
        'MESSAGE': 'message', 'AWARDS': 'awards', 'OUTLINE': 'outline', 'BOOKS': 'books', 'FLOW': 'flow',
        'NEWSLETTER': 'newsletter', 'RECRUIT': 'recruit', 'DESIGN ORDER': 'designOrder', 'CONTACT': 'contact',
        'DETAIL': 'detail', 'DATA': 'data', 'OTHER WORKS': 'otherWorks', 'MORE': 'more', 'Related Site :': 'relatedSites',
        'Name': 'name', 'Email': 'email', 'Questions': 'questions', 'Send message': 'sendMessage',
        'Leave your questions and R.W.H Group will get in touch.': 'contactNote',
        'Liên hệ R.W.H Group ngay hôm nay để được tư vấn và kết nối với các chuyên gia Nhật Bản.': 'footerInvite',
        'R.W.H Group – Japanese Expertise, Better Living.': 'tagline', 'Design &amp; Build': 'services'
    }
    def text_node(match):
        tag, attrs, value = match.groups()
        key = labels.get(value.strip())
        if not key or 'data-i18n=' in attrs:
            return match.group()
        return f'<{tag}{attrs} data-i18n="{key}">{value}</{tag}>'
    markup = re.sub(r'<(a|p|h2|label|button|li|span)([^>]*)>([^<]+)</\1>', text_node, markup)
    aria = {
        'Main navigation': 'navigation', 'Selected architecture projects': 'selectedProjects',
        'Back to first project': 'firstProject', 'Next project': 'nextProject', 'Về đầu dự án': 'projectTop',
        'R.W.H Group — Trang chủ': 'home', 'Liên hệ R.W.H Group': 'contactRegion',
        'Gọi R.W.H Group: 0982-132-489': 'call', 'Close contact form': 'closeContact',
        'Xem ảnh dự án': 'imageViewer', 'Đóng ảnh': 'closeImage', 'Ảnh trước': 'previousImage', 'Ảnh tiếp theo': 'nextImage'
    }
    def aria_node(match):
        attrs, value, rest = match.groups()
        key = aria.get(value)
        if not key or 'data-i18n-aria-label=' in attrs + rest:
            return match.group()
        return f'<{attrs}aria-label="{value}"{rest} data-i18n-aria-label="{key}">'
    markup = re.sub(r'<([^<>]*?)aria-label="([^"]*)"([^<>]*?)>', aria_node, markup)
    markup = markup.replace('Published by FRAME<br>2025 Release', '<span data-i18n="published">Published by FRAME</span><br><span data-i18n="release">2025 Release</span>')
    # Keep the arrow SVG when changing the contact action's text.
    markup = markup.replace('>LIÊN HỆ <svg', '><span data-i18n="contact">LIÊN HỆ</span> <svg')
    return markup


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
    key = f'project.{project["slug"]}'
    sections.append(f'''    <section class="section sec{number:02d} mainImg" id="project-{number}">
        <div class="full"></div>
        <div class="bg pc" style="background-image: url(./{e(project['hero'])})"></div>
        <div class="bg sp" style="background-image: url(./{e(project['mobile'])})"></div>
        <div class="txtBox"><a href="./projects/{e(project['slug'])}/index.html" data-project-open aria-haspopup="dialog" aria-controls="project-panel" data-project-title="{e(project['title'])}" aria-label="Xem chi tiết {e(project['title'])}">
            <h2><span>{e(project['title'])}</span></h2>
            <p class="txt"><span class="shuffle" data-i18n="{key}.metadata">{e(copy['vi'][key + '.metadata'])}</span><br><span class="shuffle" data-i18n="{key}.subtitle">{e(project['subtitle'])}</span></p>
            <div class="detail"><p class="txt01">DETAIL</p><p class="line"></p></div>
        </a></div>
    </section>''')

index = DIST / 'index.html'
html = index.read_text()
html, count = re.subn(r'    <section class="section sec01 mainImg".*?(?=    <section class="section [^"]*fp-auto-height)', '\n'.join(sections) + '\n', html, flags=re.S)
assert count == 1, 'Could not locate the landing-page project sections'
html = html.replace('<html lang="en">', '<html lang="vi">')
html = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="Các dự án R.W.H Group: nghỉ dưỡng, Onsen, chăm sóc sức khỏe, khách sạn và kiến trúc đô thị tại Việt Nam và Nhật Bản.">', html)
html = re.sub(r'(?:src|href)="\./assets/rwh-reference-wordmark\.svg(?:\?v=[^"]*)?"', lambda match: match.group().split('=')[0] + f'="./{asset("assets/rwh-reference-wordmark.svg")}"', html)
html = re.sub(r'src="\./app\.js(?:\?v=[^"]*)?"', f'src="./{asset("app.js")}"', html)
html = re.sub(r'href="\./rwh-footer\.css(?:\?v=[^"]*)?"', f'href="./{asset("rwh-footer.css")}"', html)
html = re.sub(r'<link rel="stylesheet" href="\./rwh-menu\.css[^\"]*">\n?', '', html)
html = html.replace('<script src="./app.js', f'<link rel="stylesheet" href="./{asset("rwh-menu.css")}">\n<script src="./app.js', 1)
html = re.sub(r'<link rel="stylesheet" href="\./site-language\.css[^\"]*">\n?', '', html)
html = re.sub(r'<script src="\./(?:project-copy|site-language)\.js[^\"]*" defer></script>\n?', '', html)
html = html.replace('<script src="./app.js', f'<link rel="stylesheet" href="./{asset("site-language.css")}">\n<script src="./{asset("project-copy.js")}" defer></script>\n<script src="./{asset("site-language.js")}" defer></script>\n<script src="./app.js', 1)
html = re.sub(r'<link rel="stylesheet" href="\./project-panel\.css[^\"]*">\n?', '', html)
html = re.sub(r'<script src="\./project-panel\.js[^\"]*" defer></script>\n?', '', html)
html = html.replace('<script src="./app.js', f'<link rel="stylesheet" href="./{asset("project-panel.css")}">\n<script src="./{asset("project-panel.js")}" defer></script>\n<script src="./app.js', 1)
html = re.sub(r'<dialog class="project-panel".*?</dialog>\n?', '', html, flags=re.S)
html = html.replace('</body>', '''<dialog class="project-panel" id="project-panel" aria-labelledby="project-panel-title">
    <h2 class="project-panel-title" id="project-panel-title"></h2>
    <div class="project-panel-status" role="status">
        <div class="panel-wordmark">R.W.H<small>Group</small></div>
        <p class="project-panel-loading" data-i18n="loadingProject">Đang tải dự án…</p>
        <div class="project-panel-error"><p data-i18n="projectLoadError">Chưa tải được dự án. Vui lòng thử mở lại.</p><a data-panel-fallback target="_blank" rel="noopener noreferrer" data-i18n="openProjectPage">Mở trang dự án</a></div>
    </div>
    <iframe title="Chi tiết dự án" tabindex="-1" aria-hidden="true"></iframe>
    <button class="project-panel-close" data-panel-close type="button" aria-label="Đóng chi tiết dự án" data-i18n-aria-label="closeProject" autofocus><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
</dialog>
</body>''')
html = re.sub(r'<div class="language-switch".*?</div>\n?', '', html, flags=re.S)
html = html.replace('<body id="top">', '<body id="top">\n' + switcher)
html = html.replace('>SCROLL<span>', '><b class="scroll-label" data-i18n="scroll">CUỘN</b><span>')
html = html.replace('<meta name="description"', '<meta data-i18n-content="siteDescription" name="description"')
html = localize_ui(html)
html = re.sub(r'<link rel="stylesheet" href="\./rwh-videos\.css[^\"]*">\n?', '', html)
html = re.sub(r'<script src="\./rwh-videos\.js[^\"]*" defer></script>\n?', '', html)
html = html.replace('<script src="./app.js', f'<link rel="stylesheet" href="./{asset("rwh-videos.css")}">\n<script src="./{asset("rwh-videos.js")}" defer></script>\n<script src="./app.js', 1)
html = re.sub(r'<dialog class="video-library".*?</dialog>\n?', '', html, flags=re.S)
html = re.sub(r'<dialog class="video-player".*?</dialog>\n?', '', html, flags=re.S)
html = html.replace('</body>', video_library() + '\n</body>')
html = re.sub(r'^[ \t]*<li><a [^>]*data-videos-open[^>]*>.*?</a></li>\n?', '', html, flags=re.M)
html = html.replace('<li><a href="https://www.rwh-group.com/news"', '<li><a href="#video-library" data-videos-open aria-haspopup="dialog" aria-controls="video-library" data-i18n="videos">VIDEO</a></li>\n                    <li><a href="https://www.rwh-group.com/news"', 1)
html = re.sub(r'^[ \t]*<a class="rwh-footer-videos".*?</a>\n?', '', html, flags=re.M)
html = html.replace('<p class="rwh-footer-services"', '<a class="rwh-footer-videos" href="#video-library" data-videos-open aria-haspopup="dialog" aria-controls="video-library" data-i18n="watchVideos">Xem video ↗</a>\n                        <p class="rwh-footer-services"', 1)
html = '\n'.join(line.rstrip() for line in html.splitlines() if line.strip()) + '\n'
index.write_text(html)

# Reuse the approved homepage menu, footer and owner contact form.
def detail_links(markup):
    markup = markup.replace('href="./', 'href="../../').replace('src="./', 'src="../../')
    markup = markup.replace('href="https://apollo-aa.jp/works"', 'href="../../index.html"')
    markup = markup.replace('href="https://apollo-aa.jp/archi_worksprojects/projects"', 'href="../../index.html"')
    return markup


navigation = detail_links(re.search(r'<nav class="menuBox[^\"]*".*?</nav>', html, re.S).group())
footer = detail_links(re.search(r'<footer id="gFooter"[^>]*>.*?</footer>', html, re.S).group())
footer = footer.replace('href="#container"', 'href="../../index.html"')
footer = footer.replace('<div class="fInner">', '<div class="fInner"><div class="pagetop"><a href="#container" aria-label="Về đầu dự án"><img src="../../assets/apollo-reference/132dcb5de486.png" alt="" width="15"></a></div>', 1)
contact_dialog = re.search(r'<dialog class="contact-modal".*?</dialog>', html, re.S).group()

for i, project in enumerate(projects):
    number = project['number']
    key = f'project.{project["slug"]}'
    folder = DIST / 'projects' / project['slug']
    folder.mkdir(parents=True, exist_ok=True)
    facts = ''.join(f'<tr><th scope="row" data-i18n="{key}.fact.{row}.label">{e(label)}</th><td data-i18n="{key}.fact.{row}.value">{e(value)}</td></tr>' for row, (label, value) in enumerate(project['facts']))
    figures = []
    for j, photo in enumerate(project['images']):
        caption = f'{project["title"]} — {j + 1:02d}'
        source = project['hero'] if j == 0 else photo['src']
        loading = 'loading="eager" fetchpriority="high"' if j == 0 else 'loading="lazy"'
        figures.append(f'''<div class="photo"><a class="gallery-image" href="../../{e(source)}" data-caption="{e(caption)}" data-project-title="{e(project['title'])}" data-photo-number="{j + 1}" aria-label="Phóng to ảnh {j + 1} của {e(project['title'])}"><img src="../../{e(source)}" width="{photo['width']}" height="{photo['height']}" alt="{e(caption)}" {loading} decoding="async"></a></div>''')
    related = []
    for offset in range(1, 4):
        item = projects[(i + offset) % len(projects)]
        item_key = f'project.{item["slug"]}'
        related.append(f'''<li><a href="../{e(item['slug'])}/index.html"><span class="over"><span class="pho"><img src="../../{e(item['images'][0]['thumbnail'])}" alt="{e(item['title'])}" loading="lazy"></span></span><span class="txt margin"><span class="ttl">{e(item['title'])}</span><span class="txt01"><span data-i18n="{item_key}.category">{e(copy['vi'][item_key + '.category'])}</span><br><span data-i18n="{item_key}.subtitle">{e(item['subtitle'])}</span></span></span></a></li>''')
    page = f'''<!doctype html>
<html lang="vi"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{e(project['title'])} | R.W.H Group</title>
<meta data-i18n-content="{key}.description" name="description" content="{e(project['description'])}">
<meta name="theme-color" content="#292929">
<link rel="icon" href="../../{asset('assets/rwh-reference-wordmark.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&amp;family=Roboto:wght@300;400;500&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../{asset('project-gallery.css')}">
<link rel="stylesheet" href="../../{asset('rwh-footer.css')}">
<link rel="stylesheet" href="../../{asset('rwh-menu.css')}">
<link rel="stylesheet" href="../../{asset('site-language.css')}">
<link rel="stylesheet" href="../../{asset('project-panel.css')}">
<link rel="stylesheet" href="../../{asset('rwh-videos.css')}">
<script src="../../{asset('project-copy.js')}" defer></script>
<script src="../../{asset('site-language.js')}" defer></script>
<script src="../../{asset('project-panel.js')}" defer></script>
<script src="../../{asset('project-motion.js')}" defer></script>
<script src="../../{asset('rwh-videos.js')}" defer></script>
<script src="../../{asset('project-gallery.js')}" defer></script>
<script src="../../{asset('contact-form.js')}" defer></script>
</head><body>
{switcher}
<div id="container">
<header id="gHeader" class="header01"><div class="inner"><h1><a class="hLogo" href="../../index.html" aria-label="R.W.H Group — Trang chủ"><img class="pc" src="../../{asset('assets/rwh-reference-wordmark.svg')}" alt="R.W.H Group" width="357"><img class="sp" src="../../{asset('assets/rwh-reference-wordmark.svg')}" alt="R.W.H Group" width="255"></a></h1><div class="comTopLinkBox"><h2>{e(project['title'])}</h2><div class="rBox"><p class="txt" data-i18n="{key}.metadata">{e(copy['vi'][key + '.metadata'])}</p></div></div></div></header>
<div class="meunRBox"><button class="menu" type="button" aria-label="Open menu" aria-controls="navigation" aria-expanded="false"><span class="top"></span><span class="bottom"></span></button></div>
{navigation}
<main id="main" tabindex="-1">
<section class="sec01" aria-label="{e(project['title'])}"><div class="inner01">
<section class="project-film" id="project-film" aria-labelledby="project-film-title"><h2 id="project-film-title" data-i18n="videos">VIDEO</h2>{video_card(videos[video_sources['projectAssignments'][project['slug']]], '../../')}</section>
<div class="project-photos">{''.join(figures)}</div>
<div class="project-overview" id="project-overview">
<div class="textArea"><div class="bdBox"><div class="lBox"><p class="project-subtitle" data-i18n="{key}.subtitle">{e(project['subtitle'])}</p><p class="project-description" data-i18n="{key}.description">{e(project['description'])}</p></div></div></div>
<div class="txtBox"><div class="tBox"><h2>DATA</h2></div><div class="rBox"><ul class="txtListUl"><li><table><tbody>{facts}</tbody></table></li></ul></div></div>
</div>
</div></section>
<section class="sec02"><div class="inner"><h2 class="h2Ttl">OTHER WORKS</h2><ul class="listUl listUl01">{''.join(related)}</ul><div class="comBtn"><a href="../../index.html"><span class="en">MORE</span></a></div></div></section>
</main>
{footer}
</div>
{contact_dialog}
{video_library('../../')}
<dialog class="image-viewer" aria-label="Xem ảnh dự án"><button type="button" class="viewer-close" aria-label="Đóng ảnh" autofocus><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><button type="button" class="viewer-prev" aria-label="Ảnh trước">←</button><div class="viewer-stage"><img alt=""><p class="viewer-caption" aria-live="polite"></p></div><button type="button" class="viewer-next" aria-label="Ảnh tiếp theo">→</button></dialog>
</body></html>
'''
    (folder / 'index.html').write_text(localize_ui(page))

print(f'Rendered {len(projects)} ordered project sections and local detail galleries.')
