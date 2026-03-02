import { Button } from 'shared/components/button';
import { Text } from 'shared/components/text';

import {
  ControlPanelWrapper,
  PreviewControls,
  Description,
  PreviewProposalList,
  InlineLoaderStyled,
} from '../style';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from 'shared/wallet';
import { DGTooltip } from 'features/dual-governance/tooltips';
import { useIsEmergencyModeActive } from '../../hooks/use-is-emergency-mode-active';
import { Link } from '@lidofinance/lido-ui';
import { Box } from 'shared/components/box';
import { PreviewProposal } from './preveiew-proposal';
import { useProposalsCount } from '../../hooks/use-proposals-count';
import { useVotes } from 'shared/votes/hooks/use-votes';
import { useMemo } from 'react';
import { useActiveProposals } from '../../hooks/use-active-proposals';

type Props = {
  onContinue: () => void;
};

const PROPOSALS_TO_SHOW = 3;
const VOTES_LIMIT = 15;

export const DualGovernanceControlPanelPreview = ({ onContinue }: Props) => {
  const { isConnected } = useAccount();
  const { isEmergencyModeActive } = useIsEmergencyModeActive();

  const { data: proposalsCount, isLoading: isProposalsCountLoading } =
    useProposalsCount();

  const { data: votesData, isFetching: isVotesFetching } = useVotes({
    limit: VOTES_LIMIT,
    shouldGetActive: true,
  });

  const { data: activeProposals, isLoading: isActiveProposalsLoading } =
    useActiveProposals({ proposalsCount });

  const isLoading =
    isProposalsCountLoading || isVotesFetching || isActiveProposalsLoading;

  const combinedProposals = useMemo(() => {
    return [
      ...(votesData?.votes.map((vote) => ({
        isVote: true,
        proposalId: vote.proposalId,
      })) || []),
      ...(activeProposals || []).map((id) => ({
        isVote: false,
        proposalId: id,
      })),
    ];
  }, [votesData, activeProposals]);

  return (
    <ControlPanelWrapper>
      <Text size={22} weight={600}>
        Active:
      </Text>
      {isLoading && <InlineLoaderStyled />}
      {!isLoading && (
        <>
          {combinedProposals.length > 0 && (
            <PreviewProposalList>
              {combinedProposals
                .map(({ isVote, proposalId }) => (
                  <PreviewProposal
                    key={proposalId}
                    isVote={isVote}
                    proposalId={proposalId}
                  />
                ))
                .slice(0, PROPOSALS_TO_SHOW)}
            </PreviewProposalList>
          )}
          {combinedProposals.length === 0 && (
            <>
              <br />
              <Text>No active proposals</Text>
            </>
          )}
        </>
      )}
      {!isEmergencyModeActive && (
        <Description>
          If your intent is to delay or prevent proposal execution, you can
          support veto by escrowing your stETH, wstETH, or withdrawal NFTs.{' '}
          <br />
          If <b>VetoSignalling</b> <DGTooltip topic="vetoSignalling" /> is
          triggered, execution is paused for 5–45 days, depending on the
          support. If <b>RageQuit </b>
          <DGTooltip topic="rageQuit" /> starts, all escrowed tokens are
          withdrawn to ETH before any proposal can be executed.
        </Description>
      )}
      {isEmergencyModeActive && (
        <Box marginBottom="3rem">
          <Description>
            During Emergency Mode , you can still support the veto by depositing
            stETH. However, only <Link href="#">Emergency Committee</Link> can
            execute any scheduled proposal now. If the 10% RageQuit threshold is
            reached, stETH begins exiting the protocol.
          </Description>
        </Box>
      )}
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
