import removeMD from 'remove-markdown';
import { InlineLoader } from '@lidofinance/lido-ui';
import { REGEX_LIDO_VOTE_CID } from 'utils/regex-cid';
import { useQuery } from '@tanstack/react-query';
import { fetcherIPFS } from 'utils/fetcher-ipfs';
import { DescriptionText } from './style';
import { replaceJsxElements } from 'utils/replace-links-with-components';
import { splitLeadingHeading } from '@vote/utils/parse-vote-title';
import { MarkdownWrapper } from '../markdown-wrapper';

type Props = {
  metadata?: string | undefined;
  /**
   * Pre-resolved IPFS description from the archived-vote cache. When a
   * non-empty string is passed, the component renders it directly and
   * skips the runtime IPFS fetch. `null`/`undefined` means "not cached" —
   * fall through to the metadata → IPFS path.
   */
  description?: string | null;
  allowMD?: boolean;
  /** Drop the leading `# heading` line, which is rendered as the vote title. */
  hideLeadingHeading?: boolean;
};

const trimStart = (string = '') => `${string}`.replace(/^\s+/, '');

export const VoteDescription = ({
  metadata,
  description,
  allowMD,
  hideLeadingHeading,
}: Props) => {
  const cid = metadata?.match(REGEX_LIDO_VOTE_CID)?.[1] || null;

  const stripHeading = (text: string) =>
    hideLeadingHeading ? (splitLeadingHeading(text).body ?? '') : text;

  const cachedDescription = trimStart(description ?? '');
  const hasCachedDescription = cachedDescription.length > 0;

  const {
    data = '',
    error,
    isLoading: isIPFSLoading,
  } = useQuery({
    queryKey: [cid],
    queryFn: async () => await fetcherIPFS(cid || ''),
    enabled: !!cid && !hasCachedDescription,
  });

  if (metadata === '') {
    return <DescriptionText>No description.</DescriptionText>;
  }

  if (!metadata) {
    return (
      <DescriptionText>
        Failed to fetch vote description from RPC provider.
      </DescriptionText>
    );
  }

  if (hasCachedDescription) {
    const text = stripHeading(cachedDescription);
    if (!text) {
      return <DescriptionText>No description.</DescriptionText>;
    }
    if (allowMD) {
      return <MarkdownWrapper>{text}</MarkdownWrapper>;
    }
    return (
      <DescriptionText>{replaceJsxElements(removeMD(text))}</DescriptionText>
    );
  }

  if (!cid && metadata) {
    return <DescriptionText>{replaceJsxElements(metadata)}</DescriptionText>;
  }

  if (isIPFSLoading) {
    return <InlineLoader />;
  }

  const trimmedData = trimStart(data);

  if (error || !trimmedData) {
    const text = metadata.replace(REGEX_LIDO_VOTE_CID, '');
    return (
      <DescriptionText>
        {replaceJsxElements(text)}
        {text.trim() ? `\n\n` : ''}
        {`A detailed description will be uploaded to an IPFS soon. File hash: `}
        <b>{cid}</b>
        {`. To read the description, please refresh the page in 15 minutes.`}
      </DescriptionText>
    );
  }

  const text = stripHeading(trimmedData);
  if (!text) {
    return <DescriptionText>No description.</DescriptionText>;
  }

  if (allowMD) {
    return <MarkdownWrapper>{text}</MarkdownWrapper>;
  }

  return (
    <DescriptionText>{replaceJsxElements(removeMD(text))}</DescriptionText>
  );
};
