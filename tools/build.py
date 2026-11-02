#!/usr/bin/env python3
"""Bundle web/index.html (+ every local css/js it references) into ONE
self-contained HTML file: dist/oc-shimeji.html. The Android app loads web/
directly as its assets folder, so this bundle is only for sharing/standalone play.
Usage: python3 tools/build.py"""
import re, os, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
web = root / 'web'
html = (web / 'index.html').read_text(encoding='utf8')
def css(m):
    href = m.group(1)
    if href.startswith(('http:', 'https:', '//')): return m.group(0)
    return '<style>\n' + (web / href).read_text(encoding='utf8') + '</style>'
def js(m):
    src = m.group(1)
    if src.startswith(('http:', 'https:', '//')): return m.group(0)
    body = (web / src).read_text(encoding='utf8').replace('</script', '<\\/script')
    return '<script>\n' + body + '</script>'
html = re.sub(r'<link rel="stylesheet" href="([^"]+)"[^>]*>', css, html)
html = re.sub(r'<script src="([^"]+)"[^>]*></script>', js, html)
out = root / 'dist'; out.mkdir(exist_ok=True)
(out / 'oc-shimeji.html').write_text(html, encoding='utf8')
print('wrote', out / 'oc-shimeji.html', len(html.encode()) // 1024, 'KB')
