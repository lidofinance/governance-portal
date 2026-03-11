import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Address } from 'viem';

export type DelegationInfo = {
  aragonDelegateAddress: string | null | undefined;
  aragonPublicDelegate: PublicDelegate | null | undefined;
  snapshotDelegateAddress: string | null | undefined;
  snapshotPublicDelegate: PublicDelegate | null | undefined;
};

export type DelegationFormInput = {
  delegateAddress: Address | null;
};

export type DelegationFormLoading = {
  isDaoTokenBalanceLoading: boolean;
  isDelegationInfoLoading: boolean;
};

export type DelegationFormNetworkData = {
  daoTokenBalance: bigint | undefined;
  loading: DelegationFormLoading;
  refetch: () => Promise<void>;
} & DelegationInfo;

export type DelegationType = 'Aragon' | 'Snapshot';

export type DelegationFormMode = 'simple' | DelegationType;

export type DelegationFormContextValue = DelegationFormNetworkData & {
  mode: DelegationFormMode;
  onRevoke: (type: DelegationType) => Promise<boolean>;
  register: UseFormRegister<DelegationFormInput>;
  watch: UseFormWatch<DelegationFormInput>;
};

export type PublicDelegate = {
  name: string;
  avatar: string;
  address: Address;
  lido: string;
  twitter: string | null;
};

export type DelegationFormAsyncValidationContext = {
  mode: DelegationFormMode;
} & (
  | {
      isWalletActive: true;
      walletAddress: string;
      aragonDelegateAddress: string | null | undefined;
      snapshotDelegateAddress: string | null | undefined;
    }
  | {
      isWalletActive: false;
    }
);

export type DelegationFormValidationContext = {
  asyncContext: Promise<DelegationFormAsyncValidationContext>;
};

export type VoteMode = 'yay' | 'nay';

export type EligibleDelegator = {
  address: Address;
  votingPower: bigint;
  delegateVoteMode: VoteMode | 'absent';
};

export type VoterInfo = {
  address: Address;
  supports: boolean;
  stake: bigint;
};
