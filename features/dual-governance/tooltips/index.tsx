import { InfoTooltip } from 'shared/components/info-tooltip';
import { StyledContent } from './style';
import { useDualGovernanceContext } from 'providers/dual-governance';

export const tooltipTitle = {
  dualGovernance: () =>
    `Dual Governance allows stakers to withdraw their ETH in the event of a contentious proposal, while also enabling them to express concerns about its content. It requires consensus from both parties, enhancing security and decentralization.`,
  vetoSupport: () =>
    `Fraction of stETH (including wstETH and unstETH) used to block governance, shown as a percentage of the total stETH supply`,
  vetoSignalling: (totalPercent?: number) => {
    const _totalPercent = totalPercent ? `${totalPercent}%` : '3%';
    return `Triggered at a ${_totalPercent} stETH deposit threshold. Pauses proposal execution with a dynamic timelock, giving dissenting stakers time to act or exit.`;
  },
  cooldown: () =>
    `Begins when the VetoSignaling dynamic timelock ends without triggering RageQuit, letting previously blocked proposals become executable`,
  rageQuit: (totalPercent?: number) => {
    const _totalPercent = totalPercent ? `${totalPercent}%` : '10%';

    return `Activates at a ${_totalPercent} stETH deposit threshold. Automatically withdraws deposited stETH so holders can reclaim ETH before proposals execute`;
  },
  customNFT: () =>
    `Use this option to claim an NFT using its ID, even if it doesn't belong to you.`,
  readyToExecute: () =>
    `Indicates that the proposal is ready for execution. All items under Dual Governance can now be sent to Dual Governance.`,
  emergencyMode: () =>
    `Activates under severe risk, granting the Emergency Committee power to block or execute proposals outside normal flow or disconnect Dual Governance.`,
};

type Props = {
  topic: keyof typeof tooltipTitle;
};

export const DGTooltip = ({ topic }: Props) => {
  const { nextPhaseSupportThresholdPercent } = useDualGovernanceContext();

  return (
    <InfoTooltip
      title={
        <StyledContent>
          {tooltipTitle[topic](nextPhaseSupportThresholdPercent)}
        </StyledContent>
      }
    />
  );
};
