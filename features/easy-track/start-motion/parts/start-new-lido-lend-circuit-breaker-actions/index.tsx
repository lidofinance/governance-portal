import { LidoLendCircuitBreakerAction } from '@easy-track/lido-lend/actions';
import { MotionType } from '@easy-track/motion-types';
import { createActionFormPart } from '../create-action-form-part';
import { RegisterPauserFields, encodeRegisterPauser } from './register-pauser';
import {
  SetPauseDurationFields,
  encodeSetPauseDuration,
} from './set-pause-duration';
import {
  SetHeartbeatIntervalFields,
  encodeSetHeartbeatInterval,
} from './set-heartbeat-interval';

export type FormData = {
  action: string;
  marketId: string;
  pauser: string;
  newPauseDuration: string;
  newHeartbeatInterval: string;
};

const actions = {
  [LidoLendCircuitBreakerAction.RegisterPauser]: {
    Fields: RegisterPauserFields,
    encode: encodeRegisterPauser,
  },
  [LidoLendCircuitBreakerAction.SetPauseDuration]: {
    Fields: SetPauseDurationFields,
    encode: encodeSetPauseDuration,
  },
  [LidoLendCircuitBreakerAction.SetHeartbeatInterval]: {
    Fields: SetHeartbeatIntervalFields,
    encode: encodeSetHeartbeatInterval,
  },
};

export const formParts = createActionFormPart({
  motionType: MotionType.LidoLendCircuitBreakerActions,
  requiresTrustedCaller: true,
  actions,
  getDefaultFormData: (): FormData => ({
    action: '',
    marketId: '',
    pauser: '',
    newPauseDuration: '',
    newHeartbeatInterval: '',
  }),
});

export const encodeCircuitBreakerActionsCallData = formParts.encodeCallData;
