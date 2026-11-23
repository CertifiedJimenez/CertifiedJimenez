# Cristofer Jimenez · Portfolio

React + TypeScript + Vite, with local fonts, original SVG artwork, scroll reveals,
hover emblems, theme switching and alternate artwork. Bun manages dependencies and scripts.

## Run with Compose

```sh
docker compose up --build
```

Open **http://localhost:5173**. Source edits hot reload inside the container.
A named volume separates Linux dependencies from host dependencies. Startup installs
the frozen lockfile. Restart after changing dependencies.
Use `PORT=5174 docker compose up --build` to choose another host port.
To open the preview on a phone on the same Wi-Fi, set `PORTFOLIO_BIND_HOST`
to your computer's Wi-Fi IP address in `.env`, run `docker compose up -d`,
and open `http://<wifi-ip>:5173` on the phone.

```sh
docker compose down
```

## Run with Bun

Requires Bun 1.3.0 or newer. Scripts explicitly run tools with Bun.

```sh
bun install --frozen-lockfile
bun run dev
```

## Edit content

Start with **`src/content/portfolio.ts`**. It contains the name, role, contact details,
biography, skills, social links and project list. A project's `title` array controls
line breaks. Add or reorder project objects without editing component code.

The outlined Jimenez wordmark preserves the original letter animation. Changing
`surname` switches to editable SVG text in the same display font.

```text
public/                         Files copied into a normal build
src/
  assets/{fonts,icons,images}/   Local WOFF2 fonts and SVG artwork
  animations/                   Typed GSAP entrance, scroll and interaction routines
  components/
    common/                     Artwork, links and ornamental divider
    layout/{Header,Footer}/     Page layout components
    sections/                   Hero, Wordmark, Projects and About
  content/portfolio.ts          Editable portfolio content
  context/                      Display-mode state and provider
  hooks/                        Motion lifecycle and shared context hooks
  pages/Home/                   Page composition
  styles/                       Fonts, tokens, reset, grid and shared styling
  test/                         Interaction and lint-contract tests
  types/portfolio.ts            Content contracts
  App.tsx                       Application providers
  main.tsx                      React entry point
scripts/                        HTML export verification and ESLint rule
```

Component CSS lives alongside each component. Edit `src/styles/variables.css` to change
the palette, typography, section spacing, divider sizes and link transitions.
`--color-accent` controls links, focus outlines and the red inks in the inline SVGs.
Light mode overrides the surface, text and hover variables in the same file.
Use literal CSS colours for `--color-accent` and `--color-ink` because the HTML
and install manifest also read those values. Rebuild exports after editing them.
The favicon files, social thumbnail and illustrated PNG are fixed image assets. SVGs are separate from JSX to keep components readable.
`Artwork` accepts repository-owned imports, never user HTML.
There is no features directory, Makefile, router or unused API/store scaffolding.
Vite's `index.html` belongs at the repository root, not inside `public/`.

## Quality checks and documentation

```sh
bun run check        # TypeScript, ESLint, Prettier and tests
bun run lint:fix
bun run format
bun run test:watch
```

Every component must have a JSDoc description, `@component`, `@param` when accepting
props, and `@returns`. ESLint rejects missing documentation and tags, including arrow
components. TypeScript supplies types; comments explain purpose and behavior.

```tsx
/**
 * Renders the profile's primary contact action.
 * @component
 * @param props - Contact destination and visible label.
 * @returns The contact link.
 */
export function ContactLink(props: { href: string; label: string }) {
  return <a href={props.href}>{props.label}</a>;
}
```

Motion hooks clean up animations, listeners, scroll instances and observers on
StrictMode checks, hot reload and unmount. Reduced-motion preferences disable
entrance and scroll movement while preserving visible content and controls.

## Build a site or one HTML file

```sh
bun run build         # Static deployment output: dist/
bun run preview       # Preview the production build
bun run build:html    # Portable export: dist-standalone/index.html
```

The HTML export embeds JavaScript, CSS, fonts, SVGs and the alternate image. Open it
directly from disk; no server or network is required for visual assets. External
project/profile links still need internet access. Generated builds are ignored by Git.

Checks and exports also work inside the running container:

```sh
docker compose exec portfolio bun run check
docker compose exec portfolio bun run build:html
```

## GitHub Pages

Pushes to `main` run the quality checks, build both exports and publish `dist/`
to GitHub Pages. The workflow uses the Pages URL for canonical and sharing links.
You can also run **Build and deploy portfolio** manually on `main`.

## Reference and content

Design reference: [crrtt.com](https://www.crrtt.com/), original design by Brijan Powell.
Artwork and fonts were retained from the approved local recreation. Motion is now
implemented in TypeScript with GSAP and Lenis.
Content comes from the existing portfolio,
[LinkedIn](https://www.linkedin.com/in/cristofer-jimenez) and the public
[DriveLog repository](https://github.com/CertifiedJimenez/drivelog).
Social previews use the profile title and description from `src/content/portfolio.ts`.
For builds outside GitHub Pages, set `siteUrl` there to the final site address.
The static HTML includes Open Graph and Twitter Card tags before React runs.
The normal build includes the original icons and `share.jpg`. Link previews require
a public HTTPS page and image. If you host the single HTML export, also serve
`public/share.jpg` at the image URL in its metadata. The offline page itself
uses an embedded favicon. The preview requests no indexing.
