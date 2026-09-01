import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import {
  EvmAddressesByChain,
  parseEvmSupportedChainId,
} from '../evm-addresses';
import { MOTION_TAGS, MotionCategory } from '../motion-categories';
import { MotionType } from '../motion-types';

export const getCategoryFactories = (
  chainId: CHAINS,
  categories: MotionCategory[],
): string[] => {
  const addresses = EvmAddressesByChain[parseEvmSupportedChainId(chainId)];

  return Object.entries(addresses)
    .filter(
      ([motionType, address]) =>
        Boolean(address) &&
        categories.includes(MOTION_TAGS[motionType as MotionType][0]),
    )
    .map(([, address]) => address.toLowerCase());
};
