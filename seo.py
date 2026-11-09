"""Generate canonical metadata from approved project content, not browser state."""
import json
import re
from html import escape
from pathlib import Path
from xml.etree import ElementTree as ET


def render_seo(root):
    dist = root / 'dist'
    config = json.loads((root / 'SITE_CONFIG.json').read_text())
    origin = config['origin'].rstrip('/')
    projects = json.loads((root / 'PROJECT_SOURCES.json').read_text())['projects']
    images = json.loads((root / 'LANDING_IMAGES.json').read_text())
    org = {'@type': 'Organization', '@id': origin + '/#organization', 'name': config['name'], 'url': origin + '/'}
    pages = [(dist / 'index.html', origin + '/', config['title'], config['description'], images[projects[0]['slug']]['pc'], None, 'vi')]
    office = json.loads((root / 'OFFICE_CONTENT.json').read_text())
    pages.append((dist / 'office' / 'index.html', origin + '/office', 'Văn phòng | R.W.H Group', office['description']['vi'], images[projects[0]['slug']]['pc'], None, 'vi'))
    for p in projects:
        pages.append((dist / 'projects' / p['slug'] / 'index.html', origin + '/projects/' + p['slug'] + '/index.html', p['title'] + ' | R.W.H Group', p['description'], images[p['slug']]['pc'], p, 'vi'))
    # The Japanese page is written by hand in dist/ja/; its title, description and company data live in SITE_CONFIG.json.
    ja = config.get('ja')
    if ja:
        pages.append((dist / 'ja' / 'index.html', origin + '/ja/', ja['title'], ja['description'], ja['image'], None, 'ja'))
    # Home and /ja/ present the company in two languages; the project pages are Vietnamese only.
    alternates = {'vi': origin + '/', 'ja': origin + '/ja/', 'x-default': origin + '/'} if ja else {}
    for path, url, title, description, image, project, lang in pages:
        html = path.read_text()
        html = re.sub(r'<!-- SEO START -->.*?<!-- SEO END -->\n?', '', html, flags=re.S)
        html = re.sub(r'<title>.*?</title>', '<title>' + escape(title) + '</title>', html)
        # Keep translated descriptions under the existing language controller.
        html = re.sub(r'(<meta[^>]*name="description" content=")[^"]*', lambda m: m[1] + escape(description, quote=True), html)
        graph = [org, {'@type': 'WebSite', '@id': origin + '/#website', 'url': origin + '/', 'name': config['name'], 'publisher': {'@id': org['@id']}}]
        graph.append({'@type': 'WebPage', '@id': url + '#webpage', 'url': url, 'name': title, 'description': description, 'inLanguage': lang, 'isPartOf': {'@id': origin + '/#website'}, 'primaryImageOfPage': {'@type': 'ImageObject', 'url': origin + '/' + image}})
        if lang == 'ja':
            graph[-1]['about'] = {'@id': url + '#organization'}
            graph.append({'@type': 'Organization', '@id': url + '#organization', 'url': url, **ja['organization']})
        if project:
            graph.append({'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': 'R.W.H Group', 'item': origin + '/'}, {'@type': 'ListItem', 'position': 2, 'name': project['title'], 'item': url}]})
        tags = ['<!-- SEO START -->', f'<link rel="canonical" href="{escape(url, quote=True)}">', '<meta name="robots" content="index,follow,max-image-preview:large">']
        if url in alternates.values():
            tags += [f'<link rel="alternate" hreflang="{code}" href="{escape(href, quote=True)}">' for code, href in alternates.items()]
        for key, value in {'og:type': 'website', 'og:site_name': config['name'], 'og:locale': {'vi': 'vi_VN', 'ja': 'ja_JP'}[lang], 'og:title': title, 'og:description': description, 'og:url': url, 'og:image': origin + '/' + image, 'og:image:alt': project['title'] if project else title if lang == 'ja' else 'Dự án kiến trúc R.W.H Group'}.items():
            tags.append(f'<meta property="{key}" content="{escape(value, quote=True)}">')
        for key, value in {'twitter:card': 'summary_large_image', 'twitter:title': title, 'twitter:description': description, 'twitter:image': origin + '/' + image}.items():
            tags.append(f'<meta name="{key}" content="{escape(value, quote=True)}">')
        tags.append('<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False).replace('<', '\\u003c') + '</script>')
        tags.append('<!-- SEO END -->')
        html = html.replace('</head>', '\n'.join(tags) + '\n</head>')
        path.write_text(html)
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    sitemap = ET.Element('{http://www.sitemaps.org/schemas/sitemap/0.9}urlset')
    for _, url, *_ in pages:
        ET.SubElement(ET.SubElement(sitemap, 'url'), 'loc').text = url
    ET.ElementTree(sitemap).write(dist / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
    (dist / 'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: ' + origin + '/sitemap.xml\n')
