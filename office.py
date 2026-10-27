"""Render /office using the approved R.W.H navigation, footer and dialogs."""
import json
import re
from html import escape


def render_office(root, homepage, asset, switcher, video_library):
    dist = root / 'dist'
    content = json.loads((root / 'OFFICE_CONTENT.json').read_text())

    def shared(pattern):
        markup = re.search(pattern, homepage, re.S).group()
        return markup.replace('href="./', 'href="../').replace('src="./', 'src="../')

    navigation = shared(r'<nav class="menuBox[^\"]*".*?</nav>')
    navigation = navigation.replace('href="/office"', 'href="/office" aria-current="page"')
    footer = shared(r'<footer id="gFooter"[^>]*>.*?</footer>')
    footer = footer.replace('href="#container"', 'href="../index.html"')
    contact = shared(r'<dialog class="contact-modal".*?</dialog>')
    columns = []
    for language in ('vi', 'en'):
        paragraphs = ''.join(f'<p>{escape(text)}</p>' for text in content['paragraphs'][language])
        label = 'Tiếng Việt' if language == 'vi' else 'English'
        columns.append(f'<article class="office-copy" lang="{language}" aria-label="{label}">{paragraphs}</article>')
    styles = ('project-gallery.css', 'rwh-footer.css', 'rwh-menu.css', 'site-language.css',
              'rwh-videos.css', 'contact-page.css', 'office.css')
    scripts = ('site-language.js', 'project-gallery.js', 'rwh-videos.js', 'contact-form.js')
    links = '\n'.join(f'<link rel="stylesheet" href="../{asset(name)}">' for name in styles)
    scripts = '\n'.join(f'<script src="../{asset(name)}" defer></script>' for name in scripts)
    logo = '../' + asset('assets/rwh-reference-wordmark.svg')
    page = f'''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Văn phòng | R.W.H Group</title>
<meta name="description" data-i18n-content="officeDescription" content="{escape(content['description']['vi'], quote=True)}">
<meta name="theme-color" content="#292929">
<link rel="icon" href="{logo}" type="image/svg+xml">
{links}
{scripts}
</head>
<body class="office-page" id="top">
<!--
THESIS: An open, bilingual statement of R.W.H's architectural philosophy.
OWN-WORLD: The incumbent R.W.H wordmark, fonts, white reading surface, charcoal rail, menu and footer.
STORY: Read the philosophy in Vietnamese and English, then explore projects or contact the studio.
FIRST VIEWPORT: Wordmark at left, OFFICE heading on the second column axis, small links at right; two aligned text columns below.
FORM: User-pinned Apollo MESSAGE composition, adapted to R.W.H; office-20261027.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->
{switcher}
<div id="container">
<header id="gHeader" class="office-header">
  <div class="office-header-inner">
    <a class="hLogo" href="../index.html" aria-label="R.W.H Group — Trang chủ" data-i18n-aria-label="home"><img src="{logo}" alt="R.W.H Group" width="357" height="56"></a>
    <h1 class="office-title" data-i18n="office">VĂN PHÒNG</h1>
    <nav class="office-shortcuts" aria-label="Điều hướng trang" data-i18n-aria-label="navigation">
      <a href="/office" aria-current="page" data-i18n="office">VĂN PHÒNG</a>
      <a href="../index.html?project=1" data-i18n="navProjects">DỰ ÁN</a>
      <a href="#contact-modal" data-contact-open aria-haspopup="dialog" aria-controls="contact-modal" data-i18n="navContact">LIÊN HỆ</a>
    </nav>
  </div>
</header>
<div class="meunRBox"><button class="menu" type="button" aria-label="Mở menu" data-i18n-aria-label="openMenu" aria-controls="navigation" aria-expanded="false"><span class="top show"></span><span class="bottom show"></span></button><span class="office-rail-label" data-i18n="office">VĂN PHÒNG</span></div>
{navigation}
<main id="main" class="office-main" tabindex="-1">
  <div class="office-columns">{''.join(columns)}</div>
</main>
{footer}
</div>
{contact}
{video_library('../')}
</body>
</html>
'''
    folder = dist / 'office'
    folder.mkdir(exist_ok=True)
    (folder / 'index.html').write_text(page)
