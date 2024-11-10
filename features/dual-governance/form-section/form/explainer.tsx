import { useAccount } from 'wagmi';
import { Text } from 'shared/components/text';
import { DualGovernanceExplainerStyled, ExplainerButtons } from './style';
import { ConnectWalletButton } from 'shared/wallet';
import { Button } from 'shared/components/button';
import { useConsentContext } from 'providers/dg-consent';

export const DualGovernanceExplainer = () => {
  const { isConnected } = useAccount();
  const { giveConsent } = useConsentContext();

  return (
    <DualGovernanceExplainerStyled>
      <Text size={22} weight={300}>
        By adding your stETH, <b>you support the dynamic governance timelock</b>{' '}
        until consensus is reached or your stETH exits the protocol.
      </Text>
      <Text size={22} weight={300}>
        <b>If stETH</b> deposits for veto <b>exceed 1%</b> of the total token
        supply, the <b>ability to execute proposals will be blocked</b>. You can
        monitor the duration of the dynamic timelock on this page.
        <br />
        <b>If stETH</b> deposits <b>exceed 10%</b>, an automatic
        <b>withdrawal</b> of stETH <b>will begin</b> — a process known as
        RageQuit.
      </Text>
      <ExplainerButtons>
        {isConnected ? (
          <Button onClick={giveConsent}>Continue</Button>
        ) : (
          <ConnectWalletButton size="lg">Connect wallet</ConnectWalletButton>
        )}
        <Text>Read Dual Governance spec</Text>
      </ExplainerButtons>
    </DualGovernanceExplainerStyled>
  );
};
