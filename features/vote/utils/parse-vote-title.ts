const TITLE_MAX_LEN = 120;
// Bound untrusted input to the inline-Markdown stripper, independently of display truncation.
const HEADING_MAX_LEN = 1024;
const HEADING_PREFIX = /^#{1,6}[ \t]+/;

const stripInlineMarkdown = (text: string) =>
  text
    // links and images -> their text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    // html tags
    .replace(/<[^>]*>/g, '')
    // paired *emphasis*, ~~strike~~, `code` -> inner text
    .replace(/(\*{1,3}|~~|`+)(\S(?:.*?\S)?)\1/g, '$2')
    // paired _emphasis_ at word boundaries only, so snake_case survives
    .replace(/(^|\W)(_{1,3})(\S(?:.*?\S)?)\2(?=$|\W)/g, '$1$3');

const truncate = (text: string) => {
  if (text.length <= TITLE_MAX_LEN) {
    return text;
  }
  const head = text.slice(0, TITLE_MAX_LEN);
  if (/\S/.test(text[TITLE_MAX_LEN]) && /\S/.test(text[TITLE_MAX_LEN - 1])) {
    const match = head.match(/\s\S+$/);
    if (match?.index !== undefined) {
      return `${head.slice(0, match.index).trimEnd()}…`;
    }
  }
  return `${head.trimEnd()}…`;
};

type VoteTitleParts = {
  title: string | null;
  body: string | null;
};

export const splitLeadingHeading = (
  text: string | null | undefined,
): VoteTitleParts => {
  const trimmed = (text ?? '').replace(/^\s+/, '');
  if (!trimmed) {
    return { title: null, body: null };
  }

  // Find the line boundary separately to avoid overlapping whitespace matches.
  const lineEnd = trimmed.indexOf('\n');
  const firstLine = lineEnd === -1 ? trimmed : trimmed.slice(0, lineEnd);
  const heading = firstLine.match(HEADING_PREFIX);
  if (heading) {
    const headingText = firstLine
      .slice(heading[0].length)
      .replace(/[ \t]+#+[ \t]*$/, '')
      .trim();
    if (headingText.length > HEADING_MAX_LEN) {
      // Keep oversized headings in the description and use the default title.
      return { title: null, body: trimmed };
    }
    const cleanedTitle = stripInlineMarkdown(headingText).trim();
    if (cleanedTitle) {
      const body = lineEnd === -1 ? '' : trimmed.slice(lineEnd + 1).trimStart();
      return { title: cleanedTitle, body: body.length > 0 ? body : null };
    }
  }

  return { title: null, body: trimmed };
};

export const formatVoteTitle = (
  title: string | null,
  truncateTitle: boolean,
): string => {
  if (!title) {
    return 'Proposal';
  }
  return truncateTitle ? truncate(title) : title;
};
