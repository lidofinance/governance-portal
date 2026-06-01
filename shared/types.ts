import { Abi, ContractFunctionName, ContractFunctionReturnType } from 'viem';

export type ContractReadFunctionReturnType<
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'view'>,
> = ContractFunctionReturnType<abi, 'view', functionName>;

export type ActionArgs = {
  onConfirm: () => Promise<void> | void;
  onRetry?: () => void;
};

export enum ProposalStatus {
  NotExist,
  /// Proposal has been successfully submitted but not scheduled yet. This state is only reachable from NotExist
  Submitted,
  /// Proposal has been successfully scheduled after submission. This state is only reachable from Submitted
  Scheduled,
  /// Proposal has been successfully executed after being scheduled. This state is only reachable from Scheduled
  /// and is the final state of the proposal
  Executed,
  /// Proposal was cancelled before execution. Cancelled proposals cannot be resubmitted or rescheduled.
  /// This state is only reachable from Submitted or Scheduled and is the final state of the proposal.
  /// @dev A proposal is considered cancelled if it was not executed and its ID is less than the ID of the last
  /// submitted proposal at the time the cancelAll() method was called. To check if a proposal is in the Cancelled
  /// state, use the _isProposalMarkedCancelled() view function.
  Cancelled,
}
