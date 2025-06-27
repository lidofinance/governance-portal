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
import { useIsEmergencyModeActive } from '../../hooks/use-is-emergency-mode-active';
import { Link } from '@lidofinance/lido-ui';
import { Box } from 'shared/components/box';

const PROPOSALS_TO_SHOW = 3;

type Props = {
  onContinue: () => void;
};

export const DualGovernanceControlPanelPreview = ({ onContinue }: Props) => {
  const { isConnected } = useAccount();
  const { activeProposals, isLoading } = useDualGovernanceProposalsContext();

  const { isEmergencyModeActive } = useIsEmergencyModeActive();

  const restProposalsAmount = activeProposals.length - PROPOSALS_TO_SHOW;

  return (
    <ControlPanelWrapper>
      <Text size={22} weight={600}>
        Active:
      </Text>
      {isLoading && <InlineLoaderStyled />}
      {!isLoading && (
        <>
          {activeProposals.length > 0 && (
            <PreviewProposalList>
              {activeProposals
                .map((proposal) => (
                  <PreviewProposal
                    key={proposal.proposalId}
                    proposal={proposal}
                  />
                ))
                .slice(0, PROPOSALS_TO_SHOW)}
              {restProposalsAmount > 0 && (
                <Text>And {restProposalsAmount} more</Text>
              )}
            </PreviewProposalList>
          )}
          {activeProposals.length === 0 && (
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
