import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss from 'postcss';
import manifest from './manifest.json' with { type: 'json' };
import { runnerImport, type HtmlTagDescriptor, type Plugin } from 'vite';

type ContentModule = typeof import('../src/content/portfolio');

/** Resolve the two literal brand swatches needed by clients that cannot evaluate CSS. */
function readBrandColors() {
  const stylesheet = postcss.parse(readFileSync('src/styles/variables.css', 'utf8'));
  const colors = new Map<string, string>();
  stylesheet.walkRules(':root', (rule) => {
    rule.walkDecls(/^--color-(accent|ink)$/, (declaration) => {
      colors.set(declaration.prop, declaration.value);
    });
  });
  const accentColor = colors.get('--color-accent');
  const tileColor = colors.get('--color-ink');
  if (!accentColor || !tileColor)
    throw new Error('Define --color-accent and --color-ink in variables.css.');
  return { accentColor, tileColor };
}

/** Serialize the install manifest with the same colours as the page chrome. */
function renderManifest() {
  const { accentColor, tileColor } = readBrandColors();
  return JSON.stringify({ ...manifest, theme_color: accentColor, background_color: tileColor });
}

/** Write profile metadata into the initial HTML so link previews can read it without JavaScript. */
export function portfolioMetadata(standalone: boolean): Plugin {
  return {
    name: 'portfolio-metadata',
    configureServer(server) {
      server.middlewares.use('/site.webmanifest', (_req, res) => {
        res.setHeader('Content-Type', 'application/manifest+json');
        res.end(renderManifest());
      });
    },
    generateBundle() {
      if (!standalone)
        this.emitFile({ type: 'asset', fileName: 'site.webmanifest', source: renderManifest() });
    },
    async transformIndexHtml(html, { server }) {
      const contentPath = 'src/content/portfolio.ts';
      const content = server
        ? ((await server.ssrLoadModule('/' + contentPath)) as ContentModule)
        : (await runnerImport<ContentModule>(resolve(contentPath), { configFile: false })).module;
      const { name, role, description, linkedIn, github } = content.portfolio;
      const pagesBaseUrl = process.env.PAGES_BASE_URL;
      const canonical = new URL(pagesBaseUrl ? pagesBaseUrl + '/' : content.portfolio.siteUrl);
      // Pages may report HTTP while Cloudflare already serves the custom domain over HTTPS.
      if (pagesBaseUrl) canonical.protocol = 'https:';
      const siteUrl = canonical.href;
      const title = [name, role.join(' ')].join(' — ');
      const imageUrl = new URL('share.jpg', siteUrl).href;
      const colors = readBrandColors();
      const links: HtmlTagDescriptor['attrs'][] = standalone
        ? [
            {
              rel: 'icon',
              type: 'image/x-icon',
              href:
                'data:image/x-icon;base64,' + readFileSync('public/favicon.ico').toString('base64'),
            },
          ]
        : [
            { rel: 'icon', href: './favicon.ico', sizes: '16x16 32x32 48x48' },
            { rel: 'icon', type: 'image/png', sizes: '16x16', href: './icons/favicon-16x16.png' },
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: './icons/favicon-32x32.png' },
            { rel: 'apple-touch-icon', sizes: '192x192', href: './icons/192x192.png' },
            { rel: 'mask-icon', color: colors.accentColor, href: './icons/safari-pinned-tab.svg' },
            { rel: 'manifest', href: './site.webmanifest' },
          ];
      const fields: Record<string, string> = {
        ...colors,
        robots: pagesBaseUrl ? 'index, follow' : 'noindex, nofollow',
        name,
        title,
        description,
        siteUrl,
        imageUrl,
        imageAlt: 'A red illustrated hand on a black background.',
      };
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: siteUrl,
        name: title,
        description,
        mainEntity: {
          '@type': 'Person',
          name,
          jobTitle: role.join(' '),
          url: siteUrl,
          sameAs: [linkedIn, github],
        },
      };

      return {
        html: html.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
          const value = fields[key];
          if (value === undefined) throw new Error('Unknown metadata field: ' + key);
          return value
            .replaceAll('&', '&amp;')
            .replaceAll('"', '&quot;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;');
        }),
        tags: [
          ...links.map((attrs) => ({ tag: 'link', attrs, injectTo: 'head' as const })),
          {
            tag: 'script',
            injectTo: 'head',
            attrs: { type: 'application/ld+json' },
            children: JSON.stringify(structuredData).replaceAll('<', '\\u003c'),
          },
        ],
      };
    },
  };
}
