import { useCallback } from 'react';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useTxModalRecoverOrder } from './modal-stages';
import { useRecoverOrderTxSender } from './tx-sender';
import { ActionArgs } from 'shared/types';
import { Address } from 'viem';

type Args = ActionArgs & {
  orderAddress: Address;
};

export const useRecoverOrderAction = ({
  orderAddress,
  onConfirm,
  onRetry,
}: Args) => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalRecoverOrder();
  const sendRecoverOrderTx = useRecoverOrderTxSender(orderAddress);
  const waitForTx = useTxConfirmation();

  return useCallback(async () => {
    try {
      const txHash = await sendRecoverOrderTx();

      if (isMultisig) {
        txModalStages.successMultisig();
        return true;
      }

      txModalStages.pending(txHash);

      const response = await waitForTx(txHash);

      if (response.status === 'reverted') {
        txModalStages.failed(new Error(`Failed to place order`), onRetry);
        return false;
      }

      txModalStages.success();
      await onConfirm?.();

      return true;
    } catch (error) {
      console.warn(error);
      txModalStages.failed(error, onRetry);
      return false;
    }
  }, [
    isMultisig,
    txModalStages,
    sendRecoverOrderTx,
    waitForTx,
    onConfirm,
    onRetry,
  ]);
};
