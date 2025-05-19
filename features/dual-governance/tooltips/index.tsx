import { InfoTooltip } from 'shared/components/info-tooltip';
import { StyledContent } from './style';

export const tooltipTitle = {
  vetoSupport: () =>
    `Amount of stETH currently signaling to pause execution. Bar shows progress toward the next threshold.`,
  vetoSignalling: () => {
    // TODO: get dynamic percent
    const _totalPercent = '1%';
    return `Triggered when ${_totalPercent} of stETH supply is locked in escrow. Pauses execution via dynamic timelock, giving stakers time to react.`;
  },
  cooldown: () =>
    'Starts when VetoSignalling ends without RageQuit. Unblocks execution.',
  rageQuit: () => {
    const _totalPercent = '10%';

    return `Triggered at ${_totalPercent} stETH threshold. Blocks execution until all locked stETH is withdrawn.`;
  },
  customNFT: () =>
    'Claim a specific NFT by ID, even if it’s not tied to your wallet.',
  readyToExecute: () =>
    'Proposal is executable immediately, regardless of the current governance state.',
  emergencyMode: () =>
    'Activates under severe risk, granting the Emergency Committee power to block or execute proposals outside normal flow or disconnect Dual Governance.',
};

type Props = {
  topic: keyof typeof tooltipTitle;
};

export const DGTooltip = ({ topic }: Props) => {
  return (
    <InfoTooltip
      title={<StyledContent>{tooltipTitle[topic]()}</StyledContent>}
    />
  );
};
