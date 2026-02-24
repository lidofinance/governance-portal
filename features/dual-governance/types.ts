import { Token } from 'shared/blockchain/types';
import { ProposalCombinedData } from './proposals/types';
import { VoteData } from 'shared/votes/types';
import { Address } from 'viem';

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

export type DualGovernanceDetailedState = {
  effectiveState: GovernanceState;
  persistedState: GovernanceState;
  persistedStateEnteredAt: number;
  vetoSignallingActivatedAt: number;
  vetoSignallingReactivationTime: number;
  normalOrVetoCooldownExitedAt: number;
  rageQuitRound: bigint;
  vetoSignallingDuration: number;
};

export type DualGovernanceConfig = {
  firstSealRageQuitSupport: bigint;
  secondSealRageQuitSupport: bigint;
  minAssetsLockDuration: number;
  vetoSignallingMinDuration: number;
  vetoSignallingMaxDuration: number;
  vetoSignallingMinActiveDuration: number;
  vetoSignallingDeactivationMaxDuration: number;
  vetoCooldownDuration: number;
  rageQuitExtensionPeriodDuration: number;
  rageQuitEthWithdrawalsMinDelay: number;
  rageQuitEthWithdrawalsMaxDelay: number;
  rageQuitEthWithdrawalsDelayGrowth: number;
};

export const VetoSupportedTokens = [
  Token.stETH,
  Token.wstETH,
  Token.unstETH,
] as const;

export type VetoSupportedTokens = (typeof VetoSupportedTokens)[number];

export type WithdrawalsMap = Record<string, bigint>; // id, stEthAmount

export type EscrowActionArgs = (
  | {
      token: 'Withdrawal NFT';
      selectedNftIds: string[];
      escrowAddress: Address;
    }
  | {
      token: 'stETH' | 'wstETH';
      amount: bigint;
      escrowAddress: Address;
    }
) & {
  showStakeLink?: boolean;
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
