import { lidoLendApplyIrmConfigAbi } from 'abi/generated';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { MotionDescriptionProps } from '../types';
import { MarketId } from './lido-lend-parts';

const abi = lidoLendApplyIrmConfigAbi;

export const LidoLendApplyIrmConfig = ({
  callData,
}: MotionDescriptionProps<typeof abi>) => {
  const [marketId, irmConfig] = callData;

  return (
    <>
      Apply Adaptive Curve IRM config <AddressPopInline address={irmConfig} />{' '}
      to Lido Lend market <MarketId marketId={marketId} />
    </>
  );
};
