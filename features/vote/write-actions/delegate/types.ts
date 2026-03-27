import { DelegationFormInput, DelegationType } from '@vote/types';

export type DelegateTxArgs = {
  type: DelegationType;
} & DelegationFormInput;
