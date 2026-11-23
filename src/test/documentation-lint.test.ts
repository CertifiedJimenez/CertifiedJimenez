// @vitest-environment node
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const eslint = new ESLint();
const filePath = 'src/components/common/Example/Example.tsx';

describe('component documentation gate', () => {
  it.each([
    'export function Example() { return <div />; }',
    'export const Example = () => <div />;',
    '/** A component without required tags. */\nexport function Example() { return <div />; }',
  ])('rejects undocumented components: %s', async (source) => {
    const [result] = await eslint.lintText(source, { filePath });
    expect(
      result?.messages.some((message) => message.ruleId === 'documentation/require-component-tags'),
    ).toBe(true);
  });
  it('accepts documented components with descriptions and tags', async () => {
    const source =
      '/**\n * Renders the example content.\n * @component\n * @returns The example element.\n */\nexport function Example() { return <div />; }';
    const [result] = await eslint.lintText(source, { filePath });
    expect(result?.errorCount).toBe(0);
  });
});
