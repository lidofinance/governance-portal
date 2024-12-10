import { Button } from 'shared/components/button';
import { Text } from 'shared/components/text';
import {
  ControlPanelWrapper,
  PreviewControls,
  PreviewProposalList,
} from './style';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from 'shared/wallet';

const PROPOSALS = [
  { name: 'Proposal #176', link: 'https://lido.fi', isDg: true },
  { name: 'Proposal #177', link: 'https://lido.fi', isDg: true },
  { name: 'LDO Vote #178', link: 'https://lido.fi', isDg: false },
];

const PROPOSALS_TO_SHOW = 3;
const TOTAL_PROPOSALS = 5;

type Props = {
  onContinue: () => void;
};

export const DualGovernanceControlPanelPreview = ({ onContinue }: Props) => {
  const { isConnected } = useAccount();
  const proposalsToShow = PROPOSALS.slice(0, PROPOSALS_TO_SHOW);

  const restProposalsAmount = TOTAL_PROPOSALS - PROPOSALS_TO_SHOW;

  return (
    <ControlPanelWrapper>
      <Text size={22} weight={600}>
        Active Proposals:
      </Text>
      {/* LDO Vote #178 — Not submitted to Dual Governance yet */}
      <PreviewProposalList>
        {proposalsToShow.map((proposal, index) => (
          <div key={index}>{proposal.name}</div>
        ))}
      </PreviewProposalList>
      {restProposalsAmount > 0 && <Text>And {restProposalsAmount} more</Text>}
      <Text size={22} weight={300}>
        Support Veto with your stETH to help block all proposals execution
        temporarily (VetoSignaling) or withdraw your stETH before execution
        (RageQuit).
      </Text>
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
