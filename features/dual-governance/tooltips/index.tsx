import { InfoTooltip } from 'shared/components/info-tooltip';
import { StyledContent } from './style';

export const tooltipTitle = {
  dualGovernance: () =>
    `Dual Governance allows stakers to withdraw their ETH in the event of a contentious proposal, while also enabling them to express concerns about its content. It requires consensus from both parties, enhancing security and decentralization.`,
  vetoSupport: () =>
    `Fraction of stETH (including wstETH and unstETH) used to block governance, shown as a percentage of the total stETH supply`,
  vetoSignalling: () => {
    const _totalPercent = '3%';
    return `Triggered at a ${_totalPercent} stETH deposit threshold. Pauses proposal execution with a dynamic timelock, giving dissenting stakers time to act or exit.`;
  },
  cooldown: () =>
    `Begins when the VetoSignaling dynamic timelock ends without triggering RageQuit, letting previously blocked proposals become executable`,
  rageQuit: () => {
    const _totalPercent = '15%';

    return `Activates at a ${_totalPercent} stETH deposit threshold. Automatically withdraws deposited stETH so holders can reclaim ETH before proposals execute`;
  },
  customNFT: () =>
    `Use this option to claim an NFT using its ID, even if it doesn't belong to you.`,
  readyToExecute: () =>
    `Proposal ready for execution can be enacted at any time, regardless of the governance state`,
  emergencyMode: () =>
    `Activates under severe risk, granting the Emergency Committee power to block or execute proposals outside normal flow or disconnect Dual Governance.`,
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
