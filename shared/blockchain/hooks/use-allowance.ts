import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { Address, zeroAddress } from 'viem';
import { useReadContract, useWatchContractEvent } from 'wagmi';
import { Token } from '../types';
import { useTokenContractObject } from './use-token-contract-object';

type Args = {
  token: Token;
  account: Address;
  spender: Address | undefined;
};

const onError = (error: unknown) =>
  console.warn('[useAllowance] error while watching events', error);

export const useAllowance = ({ token, account, spender }: Args) => {
  const queryClient = useQueryClient();
  const contract = useTokenContractObject(token);

  const enabled = !!(token && account && spender);

  const allowanceQuery = useReadContract({
    abi: contract.abi,
    address: contract.address,
    functionName: 'allowance',
    args: [account, spender ?? zeroAddress],
    query: { enabled },
  });

  const onLogs = useCallback(
    () => {
      void queryClient.invalidateQueries(
        {
          queryKey: allowanceQuery.queryKey,
        },
        { cancelRefetch: false },
      );
    },
    // queryKey is unstable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, spender, token],
  );

  useWatchContractEvent({
    abi: contract.abi,
    eventName: 'Approval',
    poll: true,
    args: useMemo(
      () => ({
        owner: account,
        spender,
      }),
      [account, spender],
    ),
    address: contract.address,
    enabled,
    onLogs,
    onError,
  });

  useWatchContractEvent({
    abi: contract.abi,
    eventName: 'Transfer',
    poll: true,
    args: useMemo(
      () => ({
        from: account,
      }),
      [account],
    ),
    address: contract.address,
    enabled,
    onLogs,
    onError,
  });

  return allowanceQuery;
};
