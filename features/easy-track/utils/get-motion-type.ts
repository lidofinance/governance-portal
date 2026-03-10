import {
  EvmAddressesByChain,
  EvmTypesByAddress,
  EvmUnrecognized,
  parseEvmSupportedChainId,
} from '../evm-addresses';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { MotionType } from '../motion-types';

export const parseScriptFactory = (chainId: CHAINS, scriptFactory: string) => {
  const address = scriptFactory.toLowerCase();
  if (
    !Object.prototype.hasOwnProperty.call(
      EvmTypesByAddress[parseEvmSupportedChainId(chainId)],
      address,
    )
  ) {
    throw new Error(`Script factory ${address} not recognized`);
  }
  return address;
};

export const getMotionTypeByScriptFactory = (
  chainId: CHAINS,
  scriptFactory: string,
): MotionType | EvmUnrecognized => {
  try {
    const lowercaseAddress = scriptFactory.toLowerCase();
    const result = (
      EvmTypesByAddress[parseEvmSupportedChainId(chainId)] as unknown as Record<
        string,
        MotionType | undefined
      >
    )[lowercaseAddress];

    if (!result) {
      return EvmUnrecognized;
    }

    return result;
  } catch (error) {
    console.error('Error in getMotionTypeByScriptFactory:', error);
    return EvmUnrecognized;
  }
};

export const getScriptFactoryByMotionType = (
  chainId: CHAINS,
  motionType: MotionType,
) => {
  return EvmAddressesByChain[parseEvmSupportedChainId(chainId)][motionType];
};
