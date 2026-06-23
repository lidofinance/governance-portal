import removeMD from 'remove-markdown';

const TITLE_MAX_LEN = 120;
const HEADING_LINE = /^#{1,6}[ \t]+(.+?)[ \t]*(?:\r?\n|$)/;

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

  const heading = trimmed.match(HEADING_LINE);
  if (heading) {
    const cleanedTitle = removeMD(heading[1]).trim();
    if (cleanedTitle) {
      const body = trimmed.slice(heading[0].length).trimStart();
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
