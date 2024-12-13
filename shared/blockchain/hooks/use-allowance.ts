import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { Address, maxUint256, zeroAddress } from 'viem';
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
    // There is no way to approve transfer of multiple unstETH ids at once
    // That is why we use isApprovedForAll for unstETH for convinience during the testnet
    // In future we should decide whether we want to approve unstETH ids one by one or not
    // TODO: remove this condition when we decide to approve unstETH ids one by one
    functionName: token === Token.unstETH ? 'isApprovedForAll' : 'allowance',
    args: [owner ?? zeroAddress, spender ?? zeroAddress],
    query: {
      enabled,
      select: (data) => {
        if (typeof data === 'boolean') {
          return data ? maxUint256 : BigInt(0);
        }
        return data;
      },
    },
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
