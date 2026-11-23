"""Create a portable HTML preview with all visual assets embedded (stdlib only)."""
import base64
import mimetypes
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def data_uri(path):
    mime = mimetypes.guess_type(path)[0] or 'application/octet-stream'
    return 'data:' + mime + ';base64,' + base64.b64encode(path.read_bytes()).decode()


def inline_css(match):
    path = ROOT / match[1]
    css = path.read_text()

    def resource(match):
        target = match[1].strip('\"\'').split('?')[0]
        return 'url(' + data_uri((path.parent / target).resolve()) + ')'

    css = re.sub(r'url\(([^)]+)\)', resource, css)
    return '<style>' + css + '</style>'


html = (ROOT / 'index.html').read_text()
html = re.sub(r'<link[^>]*href="(portfolio-assets/css/[^"]+)"[^>]*>', inline_css, html)
html = re.sub(r'<script[^>]*src="(portfolio-assets/js/[^"]+)"[^>]*>\s*</script>',
              lambda m: '<script>' + (ROOT / m[1]).read_text().replace('</script', '<\\/script') + '</script>', html)
html = re.sub(r'((?:data-src|src|href)=")(portfolio-assets/images/[^"]+)(")',
              lambda m: m[1] + data_uri(ROOT / m[2]) + m[3], html)
(ROOT / 'portfolio.html').write_text(html)
print('Created portfolio.html (' + str(len(html.encode())) + ' bytes); no external assets required.')
