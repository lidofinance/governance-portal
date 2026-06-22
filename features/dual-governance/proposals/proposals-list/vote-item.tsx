import { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
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
import * as contractAddresses from 'shared/blockchain/contract-addresses';
import { useLidoSDK } from 'providers/lido-sdk';
import { REGEX_LIDO_VOTE_CID } from 'utils/regex-cid';
import { fetcherIPFS } from 'utils/fetcher-ipfs';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import {
  replaceAddressAndCIDInMD,
  replaceImagesInMD,
  replaceLinksInMD,
} from 'utils/replace-custom-elements-in-MD';
import { WarningIconTransparent } from 'shared/components/icons';
import { getContractAddress } from 'shared/blockchain/get-contract-address';

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
  const [isUnknownContractCalled, setIsUnknownContractCalled] = useState(false);
  const { chainId } = useLidoSDK();

  const cid = description?.match(REGEX_LIDO_VOTE_CID)?.[1] || null;

  const { data = '', isLoading: isIPFSLoading } = useQuery({
    queryKey: [cid],
    queryFn: async () => await fetcherIPFS(cid || ''),
    enabled: !!cid,
  });

  const trimmedData = trimStart(data);

  const descriptionLines = description ? description.split('\n') : [];

  const { decoded } = useDecodedScript(script);

  useEffect(() => {
    if (decoded && decoded.calls.length > 0) {
      const isUnknownContractCalled = decoded.calls
        ? decoded.calls.some((call) => {
            const contractNames = Object.keys(contractAddresses);

            return !contractNames.some((contractName) => {
              try {
                const address = getContractAddress(
                  contractName as any,
                  chainId,
                );
                return address?.toLowerCase() === call.address.toLowerCase();
              } catch {
                return false;
              }
            });
          })
        : false;
      setIsUnknownContractCalled(isUnknownContractCalled);
    }
  }, [chainId, decoded]);

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

      <ProposalDescription>
        {trimmedData && cid && !isIPFSLoading && (
          <MarkdownWrap>
            <ReactMarkdown
              remarkPlugins={[[remarkGfm, {}]]}
              components={{
                a: replaceLinksInMD,
                img: replaceImagesInMD,
                code: replaceAddressAndCIDInMD,
              }}
            >
              {trimmedData}
            </ReactMarkdown>
          </MarkdownWrap>
        )}
        {descriptionLines.length > 0 && !trimmedData && !isIPFSLoading && (
          <DescriptionContent>
            {descriptionLines.slice(0, 10).map((line, index) => (
              <DescriptionText key={index}>{line}</DescriptionText>
            ))}
            {isUnknownContractCalled && (
              <UnknownContract>
                <WarningIconTransparent />
                <span>Unknown Contract Called</span>
              </UnknownContract>
            )}
          </DescriptionContent>
        )}
      </ProposalDescription>
    </ProposalListItemWrapper>
  );
};
