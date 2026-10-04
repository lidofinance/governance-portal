import { LidoLendGuardianAction } from '@easy-track/lido-lend/actions';
import { MotionType } from '@easy-track/motion-types';
import { createActionFormPart } from '../create-action-form-part';
import { AddGuardianFields, encodeAddGuardian } from './add-guardian';
import { RemoveGuardianFields, encodeRemoveGuardian } from './remove-guardian';
import {
  ReplaceGuardianFields,
  encodeReplaceGuardian,
} from './replace-guardian';
import {
  SetGuardiansQuorumFields,
  encodeSetGuardiansQuorum,
} from './set-guardians-quorum';
import {
  SetSuspectWindowFields,
  encodeSetSuspectWindow,
} from './set-suspect-window';
import { UnbanAccountsFields, encodeUnbanAccounts } from './unban-accounts';

export type FormData = {
  action: string;
  marketId: string;
  guardian: string;
  oldGuardian: string;
  newGuardian: string;
  newQuorum: string;
  newSuspectWindow: string;
  unbanRequests: { account: string; marketIds: { value: string }[] }[];
};

const actions = {
  [LidoLendGuardianAction.AddGuardian]: {
    Fields: AddGuardianFields,
    encode: encodeAddGuardian,
  },
  [LidoLendGuardianAction.RemoveGuardian]: {
    Fields: RemoveGuardianFields,
    encode: encodeRemoveGuardian,
  },
  [LidoLendGuardianAction.ReplaceGuardian]: {
    Fields: ReplaceGuardianFields,
    encode: encodeReplaceGuardian,
  },
  [LidoLendGuardianAction.SetGuardiansQuorum]: {
    Fields: SetGuardiansQuorumFields,
    encode: encodeSetGuardiansQuorum,
  },
  [LidoLendGuardianAction.SetSuspectWindow]: {
    Fields: SetSuspectWindowFields,
    encode: encodeSetSuspectWindow,
  },
  [LidoLendGuardianAction.UnbanAccounts]: {
    Fields: UnbanAccountsFields,
    encode: encodeUnbanAccounts,
  },
};

export const formParts = createActionFormPart({
  motionType: MotionType.LidoLendGuardianActions,
  requiresTrustedCaller: true,
  actions,
  getDefaultFormData: (): FormData => ({
    action: '',
    marketId: '',
    guardian: '',
    oldGuardian: '',
    newGuardian: '',
    newQuorum: '',
    newSuspectWindow: '',
    unbanRequests: [{ account: '', marketIds: [{ value: '' }] }],
  }),
});

export const encodeGuardianActionsCallData = formParts.encodeCallData;
