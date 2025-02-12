import { Button } from 'shared/components/button';
import { Text } from 'shared/components/text';
import { PreviewProposal } from './';

import {
  ControlPanelWrapper,
  PreviewControls,
  PreviewProposalList,
  Description,
  InlineLoaderStyled,
} from '../style';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from 'shared/wallet';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';
import { DGTooltip } from 'features/dual-governance/tooltips';

const PROPOSALS_TO_SHOW = 3;

type Props = {
  onContinue: () => void;
};

export const DualGovernanceControlPanelPreview = ({ onContinue }: Props) => {
  const { isConnected } = useAccount();
  const { votes, activeProposals, isLoading } =
    useDualGovernanceProposalsContext();
  const votesProposalsList = [...votes, ...activeProposals];

  const restProposalsAmount = votesProposalsList.length - PROPOSALS_TO_SHOW;

  return (
    <ControlPanelWrapper>
      <Text size={22} weight={600}>
        Active Proposals:
      </Text>
      {isLoading && <InlineLoaderStyled />}
      {!isLoading && (
        <>
          {votesProposalsList.length > 0 && (
            <PreviewProposalList>
              {votesProposalsList
                .map((proposal) => (
                  <PreviewProposal key={proposal.id} proposal={proposal} />
                ))
                .slice(0, PROPOSALS_TO_SHOW)}
              {restProposalsAmount > 0 && (
                <Text>And {restProposalsAmount} more</Text>
              )}
            </PreviewProposalList>
          )}
          {votesProposalsList.length === 0 && (
            <>
              <br />
              <Text>No active proposals</Text>
            </>
          )}
        </>
      )}
      <Description>
        Support Veto with your stETH to help block all proposals execution
        temporarily (VetoSignaling
        <DGTooltip topic="vetoSignalling" />) or withdraw your stETH before
        execution (RageQuit <DGTooltip topic="rageQuit" />
        ).
      </Description>
      <PreviewControls>
        {isConnected ? (
          <Button size="lg" onClick={onContinue}>
            Go to Veto Support
          </Button>
        ) : (
          <ConnectWalletButton size="lg">Connect wallet</ConnectWalletButton>
        )}
      </PreviewControls>
    </ControlPanelWrapper>
  );
};
