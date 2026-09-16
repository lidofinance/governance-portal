import { LidoLendMarketManagerAction } from '@easy-track/lido-lend/actions';
import { MotionType } from '@easy-track/motion-types';
import { createActionFormPart } from '../create-action-form-part';
import {
  SetInstantActivationFields,
  encodeSetInstantActivation,
} from './set-instant-activation';
import {
  SetCollateralActivationConfigFields,
  encodeSetCollateralActivationConfig,
} from './set-collateral-activation-config';
import {
  SetSettlementConfigFields,
  encodeSetSettlementConfig,
} from './set-settlement-config';
import { SetSupplyCapFields, encodeSetSupplyCap } from './set-supply-cap';
import {
  UnfreezeMarketsFields,
  encodeUnfreezeMarkets,
} from './unfreeze-markets';
import { SetFeeFields, encodeSetFee } from './set-fee';

export type FormData = {
  action: string;
  marketId: string;
  caller: string;
  enabled: boolean;
  newCap: string;
  newFee: string;
  marketIds: { value: string }[];
  collateralActivationConfig: Record<string, string>;
  settlementConfig: Record<string, string>;
};

const actions = {
  [LidoLendMarketManagerAction.SetInstantActivation]: {
    Fields: SetInstantActivationFields,
    encode: encodeSetInstantActivation,
  },
  [LidoLendMarketManagerAction.SetCollateralActivationConfig]: {
    Fields: SetCollateralActivationConfigFields,
    encode: encodeSetCollateralActivationConfig,
  },
  [LidoLendMarketManagerAction.SetSettlementConfig]: {
    Fields: SetSettlementConfigFields,
    encode: encodeSetSettlementConfig,
  },
  [LidoLendMarketManagerAction.SetSupplyCap]: {
    Fields: SetSupplyCapFields,
    encode: encodeSetSupplyCap,
  },
  [LidoLendMarketManagerAction.UnfreezeMarkets]: {
    Fields: UnfreezeMarketsFields,
    encode: encodeUnfreezeMarkets,
  },
  [LidoLendMarketManagerAction.SetFee]: {
    Fields: SetFeeFields,
    encode: encodeSetFee,
  },
};

export const formParts = createActionFormPart({
  motionType: MotionType.LidoLendMarketManagerActions,
  requiresTrustedCaller: true,
  actions,
  getDefaultFormData: (): FormData => ({
    action: '',
    marketId: '',
    caller: '',
    enabled: false,
    newCap: '',
    newFee: '',
    marketIds: [{ value: '' }],
    collateralActivationConfig: {
      minActivationDelay: '',
      maxActivationDelay: '',
      maxDelayInflow: '',
      minDepositAmount: '',
      activatingLockDuration: '',
      minActivationAmount: '',
      maxGuardiansQuorumDelay: '',
      delayPerStrike: '',
      delayPerSuspect: '',
    },
    settlementConfig: {
      sliceFloorBps: '',
      sliceFloorAssets: '',
      fullCutBelowCollateral: '',
      ltvStepBps: '',
    },
  }),
});

export const encodeManagerActionsCallData = formParts.encodeCallData;
