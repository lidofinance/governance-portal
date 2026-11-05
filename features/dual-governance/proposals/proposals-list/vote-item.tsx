import { VoteStatusBadge } from '@dg/proposals/shared-components/vote-status-badge';

import {
  ProposalListItemWrapper,
  SummarySection,
  ProposalDescription,
  VoteStatusWrapper,
  MarkdownWrap,
  DescriptionText,
  DescriptionContent,
  UnknownContract,
} from './style';
import { ProposalName } from '@dg/proposals/shared-components/proposal-name/proposal-name';
import { VoteData } from 'shared/votes/types';
import { useDecodedScript } from 'shared/hooks';
import { useLidoSDK } from 'providers/lido-sdk';
import { REGEX_LIDO_VOTE_CID } from 'utils/regex-cid';
import { fetcherIPFS, VOTE_DESCRIPTION_MAX_BYTES } from 'utils/fetcher-ipfs';
import { useQuery } from '@tanstack/react-query';
import { VoteMarkdown } from 'shared/components/vote-markdown';
import { WarningIconTransparent } from 'shared/components/icons';
import { getContractName } from 'utils/get-contract-name';

type Props = {
  script: string;
  description?: string;
  state: VoteData['state'];
  startDate: bigint;
  yea: bigint;
  nay: bigint;
} & Pick<VoteData, 'proposalId' | 'voteTime' | 'objectionPhaseTime'>;

const trimStart = (string = '') => `${string}`.replace(/^\s+/, '');

export const VoteItem = ({
  proposalId,
  description,
  state,
  voteTime,
  objectionPhaseTime,
  startDate,
  yea,
  nay,
  script,
}: Props) => {
  const { chainId } = useLidoSDK();

  const cid = description?.match(REGEX_LIDO_VOTE_CID)?.[1] || null;

  const { data = '', isLoading: isIPFSLoading } = useQuery({
    queryKey: [cid],
    queryFn: async () =>
      await fetcherIPFS(cid || '', VOTE_DESCRIPTION_MAX_BYTES),
    enabled: !!cid,
  });

  const trimmedData = trimStart(data);

  const descriptionLines = description ? description.split('\n') : [];

  const { decoded } = useDecodedScript(script);

  const isUnknownContractCalled =
    !!decoded &&
    decoded.calls.some(
      (call) => getContractName(chainId, call.address) === null,
    );

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <ProposalName isAragon id={proposalId} chainId={chainId} />
        <VoteStatusWrapper>
          <VoteStatusBadge
            state={state}
            voteTime={voteTime}
            objectionPhaseTime={objectionPhaseTime}
            startDate={startDate}
            yea={yea}
            nay={nay}
          />
        </VoteStatusWrapper>
      </SummarySection>

      <ProposalDescription data-testid="voteDescription">
        {trimmedData && cid && !isIPFSLoading && (
          <MarkdownWrap>
            <VoteMarkdown>{trimmedData}</VoteMarkdown>
          </MarkdownWrap>
        )}
        {descriptionLines.length > 0 && !trimmedData && !isIPFSLoading && (
          <DescriptionContent>
            {descriptionLines.slice(0, 10).map((line, index) => (
              <DescriptionText key={index}>{line}</DescriptionText>
            ))}
          </DescriptionContent>
        )}
        {isUnknownContractCalled && (
          <UnknownContract>
            <WarningIconTransparent />
            <span>Unknown Contract Called</span>
          </UnknownContract>
        )}
      </ProposalDescription>
    </ProposalListItemWrapper>
  );
};
