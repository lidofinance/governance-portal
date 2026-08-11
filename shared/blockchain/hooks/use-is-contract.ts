import { Address } from 'viem';
import { useAccount, useBytecode } from 'wagmi';

import { isContractBytecode } from '../utils/is-contract-bytecode';

export const useIsContract = (address?: Address) => {
  const { address: accountAddress, chainId } = useAccount();

  const mergedAddress = address ?? accountAddress;

  return useBytecode({
    address: mergedAddress,
    chainId,
    query: {
      enabled: !!mergedAddress,
      select: isContractBytecode,
    },
  });
};
