import removeMD from 'remove-markdown';
import { REGEX_LIDO_VOTE_CID } from 'utils/regex-cid';

const TITLE_MAX_LEN = 120;

const trimStart = (s: string) => s.replace(/^\s+/, '');

const truncate = (s: string) => {
  if (s.length <= TITLE_MAX_LEN) {
    return s;
  }
  const head = s.slice(0, TITLE_MAX_LEN);
  if (/\S/.test(s[TITLE_MAX_LEN]) && /\S/.test(s[TITLE_MAX_LEN - 1])) {
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

export const splitVoteDescription = ({
  description,
  metadata,
  truncateTitle = true,
}: Args): Split => {
  const cached = description ? trimStart(description) : '';
  if (cached.length > 0) {
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

  const cutIdx = Math.min(
    sentenceEnd !== -1 ? sentenceEnd + 1 : Infinity,
    lineEnd !== -1 ? lineEnd : Infinity,
  );

  const formatTitle = (raw: string): string | null => {
    const cleaned = removeMD(raw).trim();
    if (!cleaned) {
      return null;
    }
    return truncateTitle ? truncate(cleaned) : cleaned;
  };

  if (cutIdx === Infinity) {
    if (truncateTitle) {
      return { title: formatTitle(text), body: null };
    }
    return { title: null, body: text };
  }

  const titleRaw = text.slice(0, cutIdx);
  const bodyRaw = text.slice(cutIdx).trim();

  return {
    title: formatTitle(titleRaw),
    body: bodyRaw.length > 0 ? bodyRaw : null,
  };
};
