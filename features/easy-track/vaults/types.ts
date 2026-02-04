export type VaultData = {
  nodeOperator: string;
  isVaultConnected: boolean;
  isPendingDisconnect: boolean;
  infraFeeBP: number;
  liquidityFeeBP: number;
  reservationFeeBP: number;
  badDebtEth: bigint;
  jailStatus: boolean;
};

export type TierParams = {
  shareLimit: string;
  reserveRatioBP: string;
  forcedRebalanceThresholdBP: string;
  infraFeeBP: string;
  liquidityFeeBP: string;
  reservationFeeBP: string;
};

export type Group = {
  operator: string;
  shareLimit: bigint;
  liabilityShares: bigint;
  tierIds: readonly bigint[];
};

export type GridGroup = {
  nodeOperator: string;
  shareLimit: string;
  tiers: TierParams[];
};

export type PredefinedGroupSetup = {
  label: string;
  groupShareLimit: number;
  tiers: PredefinedTierParams[];
};

type PredefinedTierParams = {
  shareLimit: number;
  reserveRatioBP: number;
  forcedRebalanceThresholdBP: number;
};
