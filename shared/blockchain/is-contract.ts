import { LidoSDKCore } from '@lidofinance/lido-ethereum-sdk';
import { Address } from 'viem';

export const isContract = async (
  address: Address,
  core: LidoSDKCore,
): Promise<boolean> => {
  const code = await core.rpcProvider.getCode({ address });
  return code != '0x';
};
