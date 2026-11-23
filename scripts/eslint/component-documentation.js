/** Enforce component-specific tags alongside eslint-plugin-jsdoc's prose/parameter rules. */
export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Require @component and @returns on PascalCase React components.' },
    schema: [],
    messages: { missing: 'Document {{name}} with a JSDoc description, @component and @returns.' },
  },
  create(context) {
    const source = context.sourceCode;
    const check = (node, name) => {
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) return;
      let statement = node.type === 'VariableDeclarator' ? node.parent : node;
      if (
        statement.parent?.type === 'ExportNamedDeclaration' ||
        statement.parent?.type === 'ExportDefaultDeclaration'
      )
        statement = statement.parent;
      const doc = source.getCommentsBefore(statement).at(-1);
      if (
        doc?.type !== 'Block' ||
        !doc.value.startsWith('*') ||
        !/@component\b/.test(doc.value) ||
        !/@returns\s+\S/.test(doc.value)
      ) {
        context.report({ node, messageId: 'missing', data: { name } });
      }
    };
    return {
      FunctionDeclaration(node) {
        if (node.id) check(node, node.id.name);
      },
      VariableDeclarator(node) {
        if (
          node.id.type === 'Identifier' &&
          ['ArrowFunctionExpression', 'FunctionExpression', 'CallExpression'].includes(
            node.init?.type,
          )
        )
          check(node, node.id.name);
      },
    };
  },
};
