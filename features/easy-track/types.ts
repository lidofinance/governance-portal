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
  evmScript?: Hex;
  evmScriptCalldata?: Hex;
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
  evmScript?: Hex;
};

export type KeysInfoOperator = {
  invalid: string[];
  duplicates: string[];
  info: {
    index: number;
    active: boolean;
    name: string;
    rewardAddress: string;
    stakingLimit: number;
    stoppedValidators: number;
    totalSigningKeys: number;
    usedSigningKeys: number;
  };
};

export type KeysInfo = {
  operators?: KeysInfoOperator[];
};

export type MEVBoostRelay = {
  uri: string;
  name: string;
  description: string;
  isMandatory: boolean;
};

export const MotionDisplayStatus = {
  DEFAULT: 'DEFAULT',
  DANGER: 'DANGER',
  ATTENDED: 'ATTENDED',
  ATTENDED_DANGER: 'ATTENDED_DANGER',
  ACTIVE: 'ACTIVE',
  ENACTED: 'ENACTED',
} as const;
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionDisplayStatus =
  (typeof MotionDisplayStatus)[keyof typeof MotionDisplayStatus];
