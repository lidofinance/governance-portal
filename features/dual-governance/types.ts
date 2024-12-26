import { Token } from 'shared/blockchain/types';
import { ProposalCombinedData } from './proposals/types';
import { VoteData } from 'shared/votes/types';
import { CHAINS } from '@lido-sdk/constants';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Log } from 'viem';

export const isVoteItem = (
  item: ProposalCombinedData | VoteData,
): item is VoteData => {
  return 'vote' in item;
};

export enum GovernanceState {
  Unset,
  Normal,
  VetoSignalling,
  VetoSignallingDeactivation,
  VetoCooldown,
  RageQuit,
}

export const VisibleGovernanceState = {
  Loading: 'Loading',
  Normal: 'Normal',
  Warning: 'Warning',
  BlockedVetoSignalling: 'BlockedVetoSignalling',
  BlockedRageQuit: 'BlockedRageQuit',
  BlockedDeactivation: 'BlockedDeactivation',
  Cooldown: 'Cooldown',
} as const;

export type VisibleGovernanceState = keyof typeof VisibleGovernanceState;

export enum TransactionState {
  SUCCESS,
  ERROR,
  PENDING,
}

export type DualGovernanceState = {
  rageQuitSupport: bigint;
  totalStEthInEscrow: string;
  amountTillNextPhasePercent: number;
  nextPhaseSupportThresholdPercent: number;
  visibleState: VisibleGovernanceState;
  stEthTotalSupply: bigint;
  detailedState: {
    effectiveState: number;
    persistedState: number;
    persistedStateEnteredAt: number;
    vetoSignallingActivatedAt: number;
    vetoSignallingReactivationTime: number;
    normalOrVetoCooldownExitedAt: number;
    rageQuitRound: bigint;
    vetoSignallingDuration: number;
  };
  isAssetManagementLocked: boolean;
  firstSealRageQuitSupport: number;
};

type DualGovernanceStateChangeEventArgs = {
  from: GovernanceState;
  to: GovernanceState;
  state: DualGovernanceState & {
    enteredAt: number;
  };
};

export type DualGovernanceStateChangeEventLog = Log & {
  args?: DualGovernanceStateChangeEventArgs;
};

export const VetoSupportedTokens = [
  Token.stETH,
  Token.wstETH,
  Token.unstETH,
] as const;

export type VetoSupportedTokens = (typeof VetoSupportedTokens)[number];

export type WithdrawalsMap = Record<string, bigint>; // id, stEthAmount

export type UseEventWatcherConfig<T> = {
  chainId: CHAINS;
  refetchFn: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<T | undefined, Error>>;
};
