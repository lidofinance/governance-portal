type MarkdownNode = {
  type: string;
  children?: MarkdownNode[];
  align?: unknown[];
  value?: string;
};

// remark-rehype pads every row to the header width, so a few KB of sparse
// rows can expand into hundreds of thousands of cells.
const MAX_TABLE_CELLS = 10_000;

const limitTables = (node: MarkdownNode) => {
  if (!node.children) {
    return;
  }

  node.children = node.children.map((child) => {
    const columns = child.align?.length ?? 0;
    const rows = child.children?.length ?? 0;
    if (child.type === 'table' && columns * rows > MAX_TABLE_CELLS) {
      return {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Table omitted: too large.' }],
      };
    }
    limitTables(child);
    return child;
  });
};

// unified plugin contract: a factory returning the tree transformer.
export const remarkLimitVoteMarkdown = () => limitTables;
