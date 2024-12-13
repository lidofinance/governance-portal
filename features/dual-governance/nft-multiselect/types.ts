import { WithdrawalsMap } from '../types';

export type NftMultiselectValuesMap = Record<string, true | undefined>;

export type NftMultiselectProps = {
  options: WithdrawalsMap | undefined;
  selectedOptions: NftMultiselectValuesMap;
  onChange: (value: Partial<NftMultiselectValuesMap>) => void;
};

export type NftMultiselectItemProps = {
  id: string;
  stEthAmount: bigint;
  checked: boolean | undefined;
  onClick: () => void;
};
