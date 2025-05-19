import { useEffect, useState } from 'react';
import { VoteStatusBadge } from 'features/dual-governance/proposals/shared-components/vote-status-badge';

import {
  ProposalListItemWrapper,
  SummarySection,
  ProposalDescription,
  DescriptionText,
  VoteStatusWrapper,
  UnknownContract,
} from './style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import { VoteData } from 'shared/votes/types';
import { useDecodedScript } from 'shared/hooks';
import * as contractAddresses from 'shared/blockchain/contract-addresses';
import { useLidoSDK } from 'providers/lido-sdk';
import { WarningIconTransparent } from 'shared/components/icons';

type Props = {
  script: string;
  description?: string;
  state: VoteData['state'];
  startDate: bigint;
  yea: bigint;
  nay: bigint;
} & Pick<VoteData, 'id' | 'voteTime' | 'objectionPhaseTime'>;

export const VoteItem = ({
  id,
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
  const descriptionLines = description ? description.split('\n') : [];

  const { decoded } = useDecodedScript(script);

  useEffect(() => {
    if (decoded && decoded.calls.length > 0) {
      const isUnknownContractCalled = decoded.calls.some((call) => {
        return !Object.values(contractAddresses).some(
          (contract) =>
            contract[chainId]?.toLowerCase() === call.address.toLowerCase(),
        );
      });
      setIsUnknownContractCalled(isUnknownContractCalled);
    }
  }, [chainId, decoded]);

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <ProposalName isAragon id={id} chainId={chainId} />
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
      {descriptionLines.length > 0 && (
        <ProposalDescription>
          {descriptionLines.map((line, index) => (
            <DescriptionText key={index}>{line}</DescriptionText>
          ))}
          {isUnknownContractCalled && (
            <UnknownContract>
              <WarningIconTransparent />
              <span>Unknown Сontract Сalled</span>
            </UnknownContract>
          )}
        </ProposalDescription>
      )}
    </ProposalListItemWrapper>
  );
};
