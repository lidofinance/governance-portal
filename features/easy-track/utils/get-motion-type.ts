import { utils } from 'ethers';
import {
  EvmAddressesByChain,
  EvmTypesByAddress,
  EvmUnrecognized,
  parseEvmSupportedChainId,
} from '../evm-addresses';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { MotionType } from '../motion-types';

export const parseScriptFactory = (chainId: CHAINS, scriptFactory: string) => {
  const address = utils.getAddress(scriptFactory);
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
    return (
      EvmTypesByAddress[parseEvmSupportedChainId(chainId)][
        parseScriptFactory(chainId, scriptFactory)
      ] ?? EvmUnrecognized
    );
  } catch {
    return EvmUnrecognized;
  }
};

export const getScriptFactoryByMotionType = (
  chainId: CHAINS,
  motionType: MotionType,
) => {
  return EvmAddressesByChain[parseEvmSupportedChainId(chainId)][motionType];
};
