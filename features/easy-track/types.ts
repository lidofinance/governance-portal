import { Address, Hex } from 'viem';

export type Motion = {
  creator: Address;
  duration: bigint;
  evmScriptFactory: Address;
  evmScriptHash: Hex;
  id: bigint;
  objectionsAmount: bigint;
  objectionsThreshold: bigint;
  snapshotBlock: bigint;
  startDate: bigint;
  status?: MotionStatus;
  enacted_at?: number;
  evmScriptCalldata?: string;
  isOnChain?: boolean;
};

export const MotionStatus = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  CANCELED: 'CANCELED',
  REJECTED: 'REJECTED',
  ENACTED: 'ENACTED',
} as const;

export type MotionStatus = (typeof MotionStatus)[keyof typeof MotionStatus];

export type NodeOperator = {
  id: number;
  active: boolean;
  name: string;
  rewardAddress: string;
  totalVettedValidators: bigint;
  totalExitedValidators: bigint;
  totalAddedValidators: bigint;
  totalDepositedValidators: bigint;
  managerAddress?: string; // Only for SDVT
};

export type RawMotionSubgraph = {
  id: string;
  evmScriptFactory: string;
  creator: string;
  duration: string;
  startDate: string;
  snapshotBlock: string;
  objectionsThreshold: string;
  objectionsAmount: string;
  evmScriptHash: string;
  evmScriptCalldata?: string;
  status: MotionStatus;
  enacted_at?: string;
  canceled_at?: string;
  rejected_at?: string;
};
