import { useCallback } from 'react';
import { useLidoSDK } from 'providers/lido-sdk';
import { getGnosisSafeLink } from '../utils/get-gnosis-safe-link';
import { openWindow } from 'utils/open-window';
import { Address, Hex } from 'viem';

type Args = {
  txHash: Hex;
  address?: Address;
};

export const useGnosisOpener = ({ txHash, address }: Args) => {
  const { chainId } = useLidoSDK();
  return useCallback(() => {
    if (!address) {
      return;
    }
    const link = getGnosisSafeLink(chainId, address, txHash);
    openWindow(link);
  }, [chainId, address, txHash]);
};
