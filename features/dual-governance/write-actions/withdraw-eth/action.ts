import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useAccount } from 'wagmi';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useWithdrawEthModalStages } from './modal-stages';
import { useWithdrawEthTxSender } from './tx-sender';
import { EscrowActionWithEthArgs } from 'features/dual-governance/types';
import { ActionArgs } from '../types';
import { getBalance } from 'viem/actions';
import { useLidoSDK } from 'providers/lido-sdk';

export const useWithdrawEthAction = ({ onConfirm, onRetry }: ActionArgs) => {
  const { address } = useAccount();
  const { rpcProvider } = useLidoSDK();
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useWithdrawEthModalStages();
  const sendWithdrawTx = useWithdrawEthTxSender();
  const waitForTx = useTxConfirmation();

  return useCallback(
    async (args: EscrowActionWithEthArgs) => {
      try {
        invariant(address, 'address must be presented');

        txModalStages.sign(args);

        const txHash = await sendWithdrawTx(args);

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(args, txHash);

        await waitForTx(txHash);

        let balance: bigint | undefined;
        if (args.token === 'ETH') {
          balance = await getBalance(rpcProvider, { address });
        }

        txModalStages.success(args, txHash, balance);
        await onConfirm();
        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      address,
      txModalStages,
      isMultisig,
      rpcProvider,
      onRetry,
      sendWithdrawTx,
      onConfirm,
      waitForTx,
    ],
  );
};
