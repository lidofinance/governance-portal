import { DelegationFormInput, DelegationType } from 'features/vote/types';

export type DelegateTxArgs = {
  type: DelegationType;
} & DelegationFormInput;
