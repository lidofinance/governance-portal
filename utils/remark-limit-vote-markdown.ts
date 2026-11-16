type MarkdownNode = {
  type: string;
  children?: MarkdownNode[];
  align?: unknown[];
  value?: string;
};

// remark-rehype pads every row to the header width, so a few KB of sparse
// rows can expand into hundreds of thousands of cells. The budget is shared
// by all tables of one description.
const MAX_TABLE_CELLS = 10_000;

const limitTables = (node: MarkdownNode, budget: { cells: number }) => {
  if (!node.children) {
    return;
  }

  node.children = node.children.map((child) => {
    const columns = child.align?.length ?? 0;
    const rows = child.children?.length ?? 0;
    if (child.type === 'table') {
      if (columns * rows > budget.cells) {
        return {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Table omitted: too large.' }],
        };
      }
      budget.cells -= columns * rows;
    }
    limitTables(child, budget);
    return child;
  });
};

const limitVoteMarkdown = (tree: MarkdownNode) =>
  limitTables(tree, { cells: MAX_TABLE_CELLS });

// unified plugin contract: a factory returning the tree transformer.
export const remarkLimitVoteMarkdown = () => limitVoteMarkdown;
