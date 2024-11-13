import { useLidoSDK } from 'providers/lido-sdk';
import { useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useTokenContractObject } from './use-token-contract-object';
import { Token } from '../types';

// TODO: add unstETH support
export const useTokenBalance = (token: Token, shouldSubscribe = true) => {
  const { address } = useAccount();
  const { subscribeToTokenUpdates } = useLidoSDK();
  const contract = useTokenContractObject(token);

  const balanceQuery = useReadContract({
    abi: contract.abi,
    address: contract.address,
    functionName: 'balanceOf',
    args: address && [address],
    query: {
      enabled: !!address,
      // because we update on events we can have high staleTime
      // this prevents loader when changing pages
      staleTime: 30_000,
    },
  });

  useEffect(() => {
    if (shouldSubscribe && address && contract?.address) {
      return subscribeToTokenUpdates({
        tokenAddress: contract.address,
        queryKey: balanceQuery.queryKey,
      });
    }
    // queryKey causes rerender
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract?.address]);

  return balanceQuery;
};
