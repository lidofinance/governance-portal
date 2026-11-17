import { decodeFunctionResult, zeroAddress } from 'viem';
import { lidoLendCircuitBreakerActionsAbi } from 'abi/generated';
import { LidoLendCircuitBreakerAction } from '@easy-track/lido-lend/actions';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { MotionDescriptionProps } from '../types';
import { Amount, MarketId } from './lido-lend-parts';

const abi = lidoLendCircuitBreakerActionsAbi;

export const LidoLendCircuitBreakerActions = ({
  callData,
}: MotionDescriptionProps<typeof abi>) => {
  const [action, payload] = callData;

  switch (action) {
    case LidoLendCircuitBreakerAction.RegisterPauser: {
      const [marketId, pauser] = decodeFunctionResult({
        abi,
        functionName: 'decodeRegisterPauserPayload',
        data: payload,
      });

      if (pauser === zeroAddress) {
        return (
          <>
            Unregister the circuit breaker pauser of market{' '}
            <MarketId marketId={marketId} />
          </>
        );
      }

      return (
        <>
          Register <AddressPopInline address={pauser} /> as the circuit breaker
          pauser of market <MarketId marketId={marketId} />
        </>
      );
    }

    case LidoLendCircuitBreakerAction.SetPauseDuration: {
      const newPauseDuration = decodeFunctionResult({
        abi,
        functionName: 'decodeConfigValuePayload',
        data: payload,
      });

      return (
        <>
          Set circuit breaker pause duration to{' '}
          <Amount value={newPauseDuration} /> seconds
        </>
      );
    }

    case LidoLendCircuitBreakerAction.SetHeartbeatInterval: {
      const newHeartbeatInterval = decodeFunctionResult({
        abi,
        functionName: 'decodeConfigValuePayload',
        data: payload,
      });

      return (
        <>
          Set circuit breaker heartbeat interval to{' '}
          <Amount value={newHeartbeatInterval} /> seconds
        </>
      );
    }

    default:
      return <>Unknown Lido Lend circuit breaker action ({action})</>;
  }
};
