import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const output = new URL('../dist-standalone/', import.meta.url);
const files = await readdir(output);
assert.deepEqual(files, ['index.html'], 'Standalone output must contain exactly one HTML file.');
const html = await readFile(new URL('index.html', output), 'utf8');
assert(!/<script[^>]+src=/i.test(html), 'JavaScript must be embedded.');
assert(!/<link[^>]+rel="stylesheet"/i.test(html), 'CSS must be embedded.');
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
  .map((match) => match[1])
  .join('\n');
assert(!/url\((?!["']?data:|["']?#)/i.test(styles), 'CSS assets must be embedded.');
assert(html.includes('data:font/woff2;base64,'), 'Local fonts must be embedded.');
assert(html.includes('data:image/png;base64,'), 'Alternate artwork must be embedded.');
console.log(
  'Verified dist-standalone/index.html: JavaScript, CSS, fonts and imagery are embedded.',
);
