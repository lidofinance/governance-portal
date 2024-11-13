import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { isContract } from 'shared/blockchain/is-contract';

import type { Address, TransactionReceipt } from 'viem';
import { useAllowance } from './use-allowance';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { Token } from '../types';
import { useWriteContractGetter } from './use-write-contract';
import { getTokenAddress } from '../get-contract-address';

const Erc20ApproveAbi = [
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

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
  amount: bigint,
  token: Token,
  spender: Address,
  owner?: string,
): UseApproveResponse => {
  const { address } = useAccount();
  const { rpcProvider, chainId } = useLidoSDK();
  const waitForTx = useTxConfirmation();
  const writeTokenContract = useWriteContractGetter(Erc20ApproveAbi);
  const mergedOwner = (owner ?? address) as Address;

  invariant(token != null, 'Token is required');
  invariant(spender != null, 'Spender is required');

  const allowanceQuery = useAllowance({
    token,
    account: mergedOwner,
    spender: spender,
  });

  const needsApprove = Boolean(
    allowanceQuery.data && amount !== 0n && amount > allowanceQuery.data,
  );

  const approve = useCallback<UseApproveResponse['approve']>(
    async ({ onTxStart, onTxSent, onTxAwaited } = {}) => {
      invariant(address, 'address is required');
      await onTxStart?.();

      const tokenAddress = getTokenAddress(token, chainId);

      const isMultisig = await isContract(address, rpcProvider);

      const approveTxHash = await writeTokenContract(tokenAddress)('approve', [
        spender,
        amount,
      ]);
      await onTxSent?.(approveTxHash);

      if (!isMultisig) {
        const receipt = await waitForTx(approveTxHash);
        await onTxAwaited?.(receipt);
      }

      await allowanceQuery.refetch();

      return approveTxHash;
    },
    [
      rpcProvider,
      address,
      token,
      chainId,
      writeTokenContract,
      spender,
      amount,
      allowanceQuery,
      waitForTx,
    ],
  );

  return {
    approve,
    needsApprove,
    allowance: allowanceQuery.data,
    ...allowanceQuery,
  };
};
