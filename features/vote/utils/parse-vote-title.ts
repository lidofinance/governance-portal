const TITLE_MAX_LEN = 120;
// The vote page shows the title untruncated; longer headings stay in the description.
const HEADING_MAX_LEN = 1024;
const HEADING_PREFIX = /^#{1,6}[ \t]+/;

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
    const title = firstLine.slice(heading[0].length).trim();
    if (title && title.length <= HEADING_MAX_LEN) {
      const body = lineEnd === -1 ? '' : trimmed.slice(lineEnd + 1).trimStart();
      return { title, body: body.length > 0 ? body : null };
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
