import { WithdrawalsMap } from '../types';
import { Address } from 'viem';

export type NftMultiselectValuesMap = Record<string, boolean | undefined>;

export type NftMultiselectProps = {
  options: WithdrawalsMap | undefined;
  selectedOptions: NftMultiselectValuesMap;
  onChange: (value: Partial<NftMultiselectValuesMap>) => void;
  disabled?: boolean;
  selectable?: boolean;
};

export type NftMultiselectItemProps = {
  id: string;
  stEthAmount: bigint;
  checked?: boolean;
  onClick: () => void;
  selectable?: boolean;
  customNftData?: NftWithdrawalRequestReturnType;
};

export type NftWithdrawalRequestReturnType = {
  amountOfStETH: bigint;
  amountOfShares: bigint;
  owner: Address;
  timestamp: bigint;
  isFinalized: boolean;
  isClaimed: boolean;
};
