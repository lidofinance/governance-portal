import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import type { Address, TransactionReceipt } from 'viem';
import { useAllowance } from './use-allowance';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { Token } from '../types';
import { useWriteContract } from './use-write-contract';
import { getTokenAddress } from '../get-contract-address';
import { erc20Abi } from 'abi/ts';
import { useIsContract } from './use-is-contract';

type ApproveOptions =
  | {
      onTxStart?: () => void | Promise<void>;
      onTxSent?: (tx: string) => void | Promise<void>;
      onTxAwaited?: (tx: TransactionReceipt) => void | Promise<void>;
    }
  | undefined;

export type UseApproveResponse = {
  approve: (options?: ApproveOptions) => Promise<string>;
  allowance: ReturnType<typeof useAllowance>['data'];
  needsApprove: boolean;
} & ReturnType<typeof useAllowance>;

export const useApprove = (
  amount: bigint | null,
  token: Token,
  spender: Address | undefined,
): UseApproveResponse => {
  const account = useAccount();
  const { chainId } = useLidoSDK();
  const waitForTx = useTxConfirmation();
  const { data: isMultisig } = useIsContract();
  const writeTokenContract = useWriteContract(erc20Abi);

  const allowanceQuery = useAllowance({
    token,
    owner: account.address,
    spender,
  });

  const needsApprove = Boolean(
    allowanceQuery.data != null &&
      amount != null &&
      amount > allowanceQuery.data,
  );

  const approve = useCallback<UseApproveResponse['approve']>(
    async ({ onTxStart, onTxSent, onTxAwaited } = {}) => {
      invariant(amount, 'amount is required');
      invariant(spender, 'spender is required');
      await onTxStart?.();

      const tokenAddress = getTokenAddress(token, chainId);

      const approveTxHash = await writeTokenContract({
        address: tokenAddress,
        functionName: 'approve',
        args: [spender, amount],
      });
      await onTxSent?.(approveTxHash);

      if (!isMultisig) {
        const receipt = await waitForTx(approveTxHash);
        await onTxAwaited?.(receipt);
      }

      await allowanceQuery.refetch();

      return approveTxHash;
    },
    [
      amount,
      spender,
      token,
      chainId,
      isMultisig,
      allowanceQuery,
      waitForTx,
      writeTokenContract,
    ],
  );

  return {
    approve,
    needsApprove,
    allowance: allowanceQuery.data,
    ...allowanceQuery,
  };
};
