import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { Address, zeroAddress } from 'viem';
import { useReadContract, useWatchContractEvent } from 'wagmi';
import { Token } from '../types';
import { useTokenContractObject } from './use-token-contract-object';

type Args = {
  token: Token;
  owner: Address | undefined;
  spender: Address | undefined;
};

const onError = (error: unknown) =>
  console.warn('[useAllowance] error while watching events', error);

export const useAllowance = ({ token, owner, spender }: Args) => {
  const queryClient = useQueryClient();
  const contract = useTokenContractObject(token);

  const enabled = !!(token && owner && spender);

  const allowanceQuery = useReadContract({
    abi: contract.abi,
    address: contract.address,
    functionName: 'allowance',
    args: [owner ?? zeroAddress, spender ?? zeroAddress],
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
    [owner, spender, token],
  );

  useWatchContractEvent({
    abi: contract.abi,
    eventName: 'Approval',
    poll: true,
    args: useMemo(
      () => ({
        owner,
        spender,
      }),
      [owner, spender],
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
        from: owner,
      }),
      [owner],
    ),
    address: contract.address,
    enabled,
    onLogs,
    onError,
  });

  return allowanceQuery;
};
