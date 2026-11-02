#!/usr/bin/env python3
"""One-time migration: split the monolithic OC Shimeji HTML into ordered
web/css/*.css and web/js/*.js files without changing load order or behaviour.
Usage: python3 tools/split_legacy.py <monolith.html> <out web dir>"""
import re, sys, os
src, out = sys.argv[1], sys.argv[2]
html = open(src, encoding='utf8').read()
os.makedirs(f'{out}/css/legacy', exist_ok=True); os.makedirs(f'{out}/js/legacy', exist_ok=True)
pat = re.compile(r'<(script|style)([^>]*)>(.*?)</\1>', re.S)
n = 0; parts = []; last = 0; manifest = []
def slug(attrs, body):
    m = re.search(r'id="([^"]+)"', attrs)
    if m: return re.sub(r'[^a-z0-9]+', '-', m.group(1).lower()).strip('-')
    return 'block'
for m in pat.finditer(html):
    tag, attrs, body = m.group(1), m.group(2), m.group(3)
    parts.append(html[last:m.start()]); last = m.end()
    if m.start() < html.find('</head>'):
        # keep the tiny no-flash bootstrap inline; move the big design-system stylesheet out
        if tag == 'script': parts.append(m.group(0)); continue
    n += 1
    name = f'{n:02d}-{slug(attrs, body)}'
    keep_id = re.search(r'id="([^"]+)"', attrs)
    if tag == 'script':
        path = f'js/legacy/{name}.js'
        open(f'{out}/{path}', 'w', encoding='utf8').write(body.strip('\n') + '\n')
        parts.append(f'<script src="{path}"{" id=%s" % chr(34)+keep_id.group(1)+chr(34) if keep_id else ""}></script>')
    else:
        path = f'css/legacy/{name}.css'
        open(f'{out}/{path}', 'w', encoding='utf8').write(body.strip('\n') + '\n')
        parts.append(f'<link rel="stylesheet" href="{path}"{" id=%s" % chr(34)+keep_id.group(1)+chr(34) if keep_id else ""}>')
    manifest.append(path)
parts.append(html[last:])
res = ''.join(parts)
# content after </html> is legal-but-quirky; move it before </body> preserving order
i = res.find('</body>'); j = res.find('</html>')
tail = res[j+len('</html>'):]
res = res[:i] + tail.strip('\n') + '\n</body>\n</html>\n'
open(f'{out}/index.html', 'w', encoding='utf8').write(res)
print('\n'.join(manifest))
