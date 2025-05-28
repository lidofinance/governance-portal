import { Token } from 'shared/blockchain/types';
import { ProposalCombinedData } from './proposals/types';
import { VoteData } from 'shared/votes/types';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Log, Address } from 'viem';

import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

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
  Emergency: 'Emergency',
  Unset: 'Unset',
} as const;

export type VisibleGovernanceState = keyof typeof VisibleGovernanceState;

export enum TransactionState {
  SUCCESS,
  ERROR,
  PENDING,
}

export type DualGovernanceState = {
  rageQuitSupport: bigint;
  totalStEthInEscrowFormatted: string;
  totalStEthInEscrow: bigint;
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
  secondSealRageQuitSupport: number;
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

export type EscrowActionArgs =
  | {
      token: 'Withdrawal NFT';
      selectedNftIds: string[];
      escrowAddress: Address;
    }
  | {
      token: 'stETH' | 'wstETH';
      amount: bigint;
      escrowAddress: Address;
    };

export type EscrowActionWithEthArgs =
  | EscrowActionArgs
  | { token: 'ETH'; amount: bigint; escrowAddress: Address };

export const isWithdrawalNFTArgs = (
  args: EscrowActionWithEthArgs,
): args is {
  token: 'Withdrawal NFT';
  selectedNftIds: string[];
  escrowAddress: Address;
} => {
  return args.token === 'Withdrawal NFT';
};

export const isTokenAmountArgs = (
  args: EscrowActionWithEthArgs,
): args is {
  token: 'stETH' | 'wstETH' | 'ETH';
  amount: bigint;
  escrowAddress: Address;
} => {
  return (
    args.token === 'stETH' || args.token === 'wstETH' || args.token === 'ETH'
  );
};

export enum UnstETHRecordStatus {
  NotLocked,
  Locked,
  Finalized,
  Claimed,
  Withdrawn,
}
