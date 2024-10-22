import {
  FormDescription,
  FormTitle,
  FormWrapper,
  ConnectButton,
} from './style';

export const Todo = () => {
  return (
    <FormWrapper>
      <FormTitle>Dual Governance</FormTitle>
      <FormDescription>
        By adding your stETH, <b>you support the governance lock</b> until the
        current proposals are canceled or other consensus reached or your stETH
        is withdrawn from the protocol.
      </FormDescription>
      <FormDescription>
        <b>If over 1%</b> of the total token supply is locked in dual
        governance, veto-signaling will activate, halting non-treasury proposal
        execution.
        <br />
        <b>If stETH deposits exceed 10%,</b> automatic stETH withdrawal from the
        protocol will start, it calls RageQuit.
      </FormDescription>
      <ConnectButton>Connect wallet</ConnectButton>
    </FormWrapper>
  );
};
