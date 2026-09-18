import { decodeFunctionResult } from 'viem';
import { lidoLendRiskStewardActionsAbi } from 'abi/generated';
import { LidoLendRiskStewardAction } from '@easy-track/lido-lend/actions';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { MotionDescriptionProps } from '../types';
import { MarketId } from './lido-lend-parts';

const abi = lidoLendRiskStewardActionsAbi;

export const LidoLendRiskStewardActions = ({
  callData,
}: MotionDescriptionProps<typeof abi>) => {
  const [action, payload] = callData;

  switch (action) {
    case LidoLendRiskStewardAction.AddRiskSteward: {
      const [marketId, steward] = decodeFunctionResult({
        abi,
        functionName: 'decodeRiskStewardPayload',
        data: payload,
      });

      return (
        <>
          Add risk steward <AddressPopInline address={steward} /> to market{' '}
          <MarketId marketId={marketId} />
        </>
      );
    }

    case LidoLendRiskStewardAction.RemoveRiskSteward: {
      const [marketId, steward] = decodeFunctionResult({
        abi,
        functionName: 'decodeRiskStewardPayload',
        data: payload,
      });

      return (
        <>
          Remove risk steward <AddressPopInline address={steward} /> from market{' '}
          <MarketId marketId={marketId} />
        </>
      );
    }

    default:
      return <>Unknown Lido Lend risk steward action ({action})</>;
  }
};
