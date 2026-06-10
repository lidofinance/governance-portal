import removeMD from 'remove-markdown';
import { REGEX_LIDO_VOTE_CID } from 'utils/regex-cid';

const TITLE_MAX_LEN = 120;

const trimStart = (text: string) => text.replace(/^\s+/, '');

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

type Split = {
  title: string | null;
  body: string | null;
};

type Args = {
  description: string | null | undefined;
  metadata: string | undefined;
  truncateTitle?: boolean;
};

const HEADING_LINE = /^#{1,6}[ \t]+(.+?)[ \t]*(?:\r?\n|$)/;

const formatTitle = (raw: string, truncateTitle: boolean): string | null => {
  const cleanedTitle = removeMD(raw).trim();
  if (!cleanedTitle) {
    return null;
  }
  return truncateTitle ? truncate(cleanedTitle) : cleanedTitle;
};

export const splitVoteDescription = ({
  description,
  metadata,
  truncateTitle = true,
}: Args): Split => {
  const cached = description ? trimStart(description) : '';
  if (cached.length > 0) {
    const heading = cached.match(HEADING_LINE);
    if (heading) {
      const body = cached.slice(heading[0].length).trimStart();
      return {
        title: formatTitle(heading[1], truncateTitle),
        body: body.length > 0 ? body : null,
      };
    }
    if (/^1\.\s/.test(cached)) {
      return { title: null, body: cached };
    }
    return splitText(cached, truncateTitle);
  }

  if (metadata) {
    const onChain = metadata.replace(REGEX_LIDO_VOTE_CID, '').trim();
    if (onChain.length > 0) {
      const { title } = splitText(onChain, truncateTitle);
      return { title, body: null };
    }
  }

  return { title: null, body: null };
};

const splitText = (text: string, truncateTitle: boolean): Split => {
  const sentenceEnd = text.search(/(?<!\d)[.!?](\s|$)/);
  const lineEnd = text.search(/\n/);

  const cutIndex = Math.min(
    sentenceEnd !== -1 ? sentenceEnd + 1 : Infinity,
    lineEnd !== -1 ? lineEnd : Infinity,
  );

  if (cutIndex === Infinity) {
    if (truncateTitle) {
      return { title: formatTitle(text, truncateTitle), body: null };
    }
    return { title: null, body: text };
  }

  const titleRaw = text.slice(0, cutIndex);
  const bodyRaw = text.slice(cutIndex).trim();

  return {
    title: formatTitle(titleRaw, truncateTitle),
    body: bodyRaw.length > 0 ? bodyRaw : null,
  };
};
