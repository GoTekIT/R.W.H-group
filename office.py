"""Render the complete parent-site Office content in the current R.W.H UI."""
import json
import re
from html import escape


def render_office(root, homepage, asset, switcher, video_library):
    dist = root / 'dist'
    content = json.loads((root / 'OFFICE_CONTENT.json').read_text())
    media = json.loads((root / 'OFFICE_MEDIA.json').read_text())
    copy = {language: {f'officeContent.{key}': value for key, value in values.items()}
            for language, values in content['copy'].items()}
    emphasis = {language: {f'officeContent.{key}': phrases for key, phrases in values.items()}
                for language, values in content['emphasis'].items()}
    (dist / 'office-copy.js').write_text('window.RWHPageCopy = ' + json.dumps(copy, ensure_ascii=False, separators=(',', ':')) + ';\nwindow.RWHOfficeEmphasis = ' + json.dumps(emphasis, ensure_ascii=False, separators=(',', ':')) + ';\n')

    english_only = {'founderRole', 'boardRole', 'teamsTitle'}
    def translated(key, language, emphasized=False):
        value = content['copy'][language][key]
        phrases = content['emphasis'][language].get(key, []) if emphasized else []
        pattern = '(' + '|'.join(re.escape(phrase) for phrase in sorted(phrases, key=len, reverse=True)) + ')'
        parts = re.split(pattern, value) if phrases else [value]
        return ''.join(f'<strong>{escape(part)}</strong>' if part in phrases else escape(part) for part in parts)

    def bilingual(key, emphasized=False):
        vi, en = content['copy']['vi'][key], content['copy']['en'][key]
        if key in english_only:
            return f'<span lang="en">{translated(key, "en", emphasized)}</span>'
        primary = f'<span lang="vi">{translated(key, "vi", emphasized)}</span>'
        if vi == en or key in {'founderName', 'boardName', 'haNoi', 'daNang', 'hue', 'hoChiMinh'}:
            return primary
        return primary + f'<span class="office-translation" lang="en">{translated(key, "en", emphasized)}</span>'

    def text(key, tag='p', attrs=''):
        return f'<{tag}{attrs}>{bilingual(key)}</{tag}>'

    def rich(key, attrs='', tag='p'):
        return f'<{tag}{attrs}>{bilingual(key, True)}</{tag}>'

    def external(key, label):
        return text(label, 'a', f' href="{escape(content["links"][key], quote=True)}" target="_blank" rel="noopener noreferrer"')

    def image(name, alt, eager=False):
        item = media[name]
        # Panoramas include every partner revealed across the source GIF timeline.
        url = '../' + asset(item.get('still', item['src']))
        width = item.get('displayWidth', item['width'])
        height = item.get('displayHeight', item['height'])
        return f'<img src="{url}" width="{width}" height="{height}" alt="{escape(content["copy"]["vi"][alt], quote=True)}" data-i18n-alt="officeContent.{alt}" loading="{"eager" if eager else "lazy"}" decoding="async">'

    def shared(pattern):
        markup = re.search(pattern, homepage, re.S).group()
        return markup.replace('href="./', 'href="../').replace('src="./', 'src="../')

    navigation = shared(r'<nav class="menuBox[^\"]*".*?</nav>').replace(' data-office-open aria-haspopup="dialog" aria-controls="project-panel"', '')
    navigation = navigation.replace('href="/office"', 'href="/office" aria-current="page"')
    footer = shared(r'<footer id="gFooter"[^>]*>.*?</footer>').replace('href="#container"', 'href="../index.html"')
    contact = shared(r'<dialog class="contact-modal".*?</dialog>')
    styles = ('project-gallery.css', 'rwh-footer.css', 'rwh-menu.css', 'site-language.css',
              'rwh-videos.css', 'contact-page.css', 'project-panel.css', 'office.css')
    scripts = ('office-copy.js', 'site-language.js', 'project-panel.js', 'office-page.js', 'project-gallery.js', 'rwh-videos.js', 'contact-form.js')
    links = '\n'.join(f'<link rel="stylesheet" href="../{asset(name)}">' for name in styles)
    scripts = '\n'.join(f'<script src="../{asset(name)}" defer></script>' for name in scripts)
    logo = '../' + asset('assets/rwh-reference-wordmark.svg')
    teams = ''.join(f'<li>{external(key, key) if key in content["links"] else text(key, "span")}</li>'
                    for key in ('tokyo', 'takasaki', 'hoChiMinh', 'daNang', 'haNoi', 'hue'))
    career = ''.join(f'<div class="office-career-row"><dt><strong>{escape(year)}</strong></dt><dd>{text(f"career{index}", "span")}</dd></div>'
                     for index, year in enumerate(content['careerYears']))
    philosophy = ''.join(rich(f'philosophy{index}') for index in range(2))
    partners = []
    for index, name in enumerate(('partners-01', 'partners-02'), start=1):
        original = image(name, f'partners{index}Alt', eager=True)
        duplicate = re.sub(r'alt="[^"]*" data-i18n-alt="[^"]*"', 'alt=""', original)
        partners.append(f'<div class="office-partner-strip" data-partner-row tabindex="0" role="region" aria-label="{escape(content["copy"]["vi"][f"partners{index}Alt"], quote=True)}" data-i18n-aria-label="officeContent.partners{index}Alt"><div class="office-partner-track"><div class="office-partner-group">{original}</div><div class="office-partner-group office-partner-copy" aria-hidden="true" hidden>{duplicate}</div></div></div>')

    def services(key):
        return text(key, 'p', ' class="office-service-list"').replace(' · ', ', ')
    page = f'''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title data-i18n="officeContent.documentTitle">Giới thiệu | R.W.H Group</title>
<meta name="description" data-i18n-content="officeContent.description" content="{escape(content['description']['vi'], quote=True)}">
<meta name="theme-color" content="#292929">
<link rel="icon" href="{logo}" type="image/svg+xml">
{links}
{scripts}
</head>
<body class="office-page" id="top">
<!--
THESIS: Complete R.W.H Office information, with the parent site's content sequence and image relationships.
OWN-WORLD: Current R.W.H Roboto typography, neutral ink, white surfaces, charcoal rail, shared menu and footer.
STORY: Meet the leadership and teams, read Honda's biography and philosophy, discover services in Japan and Vietnam, then partners.
FIRST VIEWPORT: Existing Office header above leadership at left, original portrait in the middle and office map at right.
FORM: User-pinned parent Office structure; Vietnamese body copy is followed by English. office-complete-20261027.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->
{switcher}
<div id="container">
<header id="gHeader" class="office-header">
  <div class="office-header-inner">
    <a class="hLogo" href="../index.html" aria-label="R.W.H Group — Trang chủ" data-i18n-aria-label="home"><img src="{logo}" alt="R.W.H Group" width="357" height="56"></a>
    <h1 class="office-title" data-i18n="office">GIỚI THIỆU</h1>
    <nav class="office-shortcuts" aria-label="Điều hướng trang" data-i18n-aria-label="navigation">
      <a href="/office" aria-current="page" data-i18n="office">GIỚI THIỆU</a>
      <a href="../index.html?project=1" data-i18n="navProjects">DỰ ÁN</a>
      <a href="#contact-modal" data-contact-open aria-haspopup="dialog" aria-controls="contact-modal" data-i18n="navContact">LIÊN HỆ</a>
    </nav>
  </div>
</header>
<div class="meunRBox"><button class="menu" type="button" aria-label="Mở menu" data-i18n-aria-label="openMenu" aria-controls="navigation" aria-expanded="false"><span class="top show"></span><span class="bottom show"></span></button><span class="office-rail-label" data-i18n="office">GIỚI THIỆU</span></div>
{navigation}
<main id="main" class="office-main" tabindex="-1">
  <section class="office-intro" aria-label="R.W.H Group">
    <div class="office-leadership">
      <h2 class="office-company">R.W.H <span>Group</span></h2>
      <div class="office-person">{text('founderRole', 'h3')}{external('founder', 'founderName')}</div>
      <div class="office-person">{text('boardRole', 'h3')}{text('boardName')}</div>
      <div class="office-team">{external('teams', 'teamsTitle')}<ul>{teams}</ul></div>
    </div>
    <figure class="office-portrait">{image('founder-portrait', 'portraitAlt', eager=True)}</figure>
    <figure class="office-map">{image('office-map', 'mapAlt', eager=True)}{text('mapCaption', 'figcaption')}</figure>
  </section>
  <div class="office-editorial">
    <section class="office-founder" id="founder" aria-labelledby="office-founder-title">
      {text('founderTitle', 'h2', ' id="office-founder-title"')}
      {rich('founderIntro')}
      {text('biographyTitle', 'h3')}
      <p class="office-qualification"><span lang="vi">{translated('qualification', 'vi', True)} {translated('qualificationDate', 'vi')}</span><span class="office-translation" lang="en">{translated('qualification', 'en', True)} {translated('qualificationDate', 'en')}</span></p>
      <dl class="office-career">{career}</dl>
    </section>
    <section class="office-philosophy" id="philosophy" aria-labelledby="office-philosophy-title">
      {text('philosophyTitle', 'h2', ' id="office-philosophy-title"')}
      {philosophy}
      {text('qualitiesTitle')}
      {text('qualities', 'p', ' class="office-values"')}
      {text('creativeWork')}
      <figure class="office-signature">{image('founder-signature', 'signatureAlt')}</figure>
    </section>
    <section class="office-dream" aria-labelledby="office-dream-title">
      {text('dreamTitle', 'h2', ' id="office-dream-title"')}
      <div class="office-services">
        <article>{text('japanTitle', 'h3')}{rich('japanCompany', ' class="office-service-company"')}{services('japanServices')}</article>
        <article>{text('vietnamTitle', 'h3')}{text('vietnamCompany', 'p', ' class="office-service-company"')}{services('vietnamServices')}</article>
      </div>
    </section>
  </div>
  <section class="office-partners" aria-labelledby="office-partners-title">
    <div class="office-partners-heading">{text('partnersTitle', 'h2', ' id="office-partners-title"')}</div>
    <div class="office-partner-strips">{''.join(partners)}</div>
  </section>
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
