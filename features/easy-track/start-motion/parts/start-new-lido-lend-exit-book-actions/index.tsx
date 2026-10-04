import { LidoLendExitBookAction } from '@easy-track/lido-lend/actions';
import { MotionType } from '@easy-track/motion-types';
import { createActionFormPart } from '../create-action-form-part';
import {
  SetMarketAllowedFields,
  encodeSetMarketAllowed,
} from './set-market-allowed';
import {
  SetVaultAllowedFields,
  encodeSetVaultAllowed,
} from './set-vault-allowed';

export type FormData = {
  action: string;
  markets: {
    loanToken: string;
    collateralToken: string;
    oracle: string;
    irm: string;
    lltv: string;
  }[];
  vaults: { value: string }[];
  allowed: boolean;
};

const actions = {
  [LidoLendExitBookAction.SetMorphoExitBookAllowed]: {
    Fields: SetMarketAllowedFields,
    encode: encodeSetMarketAllowed,
  },
  [LidoLendExitBookAction.SetErc4626ExitBookAllowed]: {
    Fields: SetVaultAllowedFields,
    encode: encodeSetVaultAllowed,
  },
};

export const formParts = createActionFormPart({
  motionType: MotionType.LidoLendExitBookActions,
  requiresTrustedCaller: true,
  actions,
  getDefaultFormData: (): FormData => ({
    action: '',
    markets: [
      {
        loanToken: '',
        collateralToken: '',
        oracle: '',
        irm: '',
        lltv: '',
      },
    ],
    vaults: [{ value: '' }],
    allowed: true,
  }),
});

export const encodeExitBookActionsCallData = formParts.encodeCallData;
