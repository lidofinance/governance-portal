import {
  FormDescription,
  FormTitle,
  FormWrapper,
  ConnectButton,
} from './styles';

export const DualGovernanceForm = () => {
  return (
    <FormWrapper>
      <FormTitle>Dual Governance</FormTitle>
      <FormDescription>
        By depositing your stETH in this vault, you align with the stETH
        community’s stance opposing LDO holders.
      </FormDescription>
      <FormDescription>
        If more than 1% of stETH is deposited, governance will be temporarily
        halted, preventing the execution of active proposals. Should the
        deposits reach 10%, an automatic withdrawal process will commence,
        ensuring stETH is withdrawn before any pending proposals are executed.
      </FormDescription>
      <ConnectButton>Connect wallet</ConnectButton>
    </FormWrapper>
  );
};
