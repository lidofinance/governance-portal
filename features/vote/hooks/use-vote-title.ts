import { useQuery } from '@tanstack/react-query';
import { REGEX_LIDO_VOTE_CID } from 'utils/regex-cid';
import { fetcherIPFS } from 'utils/fetcher-ipfs';
import {
  formatVoteTitle,
  splitLeadingHeading,
} from '@vote/utils/parse-vote-title';

type Args = {
  metadata: string | undefined;
  description: string | null | undefined;
  truncateTitle?: boolean;
};

export const useVoteTitle = ({
  metadata,
  description,
  truncateTitle = true,
}: Args) => {
  const cid = metadata?.match(REGEX_LIDO_VOTE_CID)?.[1] || null;
  const cachedDescription = (description ?? '').replace(/^\s+/, '');
  const hasCachedDescription = cachedDescription.length > 0;

  const { data = '' } = useQuery({
    queryKey: [cid],
    queryFn: async () => await fetcherIPFS(cid || ''),
    enabled: !!cid && !hasCachedDescription,
  });

  const text = hasCachedDescription ? cachedDescription : data;
  const { title, body } = splitLeadingHeading(text);

  return { title: formatVoteTitle(title, truncateTitle), body };
};
