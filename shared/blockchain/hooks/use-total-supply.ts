import { useChainId, useReadContract } from 'wagmi';
import { getTokenAddress } from '../get-contract-address';
import { Token } from '../types';
import { StETH } from '../contracts';

type SelectFn<T> = (data: bigint) => T;

export const useTokenTotalSupply = <T>(
  token: Token,
  selectFn?: SelectFn<T>,
) => {
  const chainId = useChainId();

  return useReadContract({
    abi: StETH.abi,
    address: getTokenAddress(token, chainId),
    functionName: 'totalSupply',
    query: {
      select: selectFn,
    },
  });
};
