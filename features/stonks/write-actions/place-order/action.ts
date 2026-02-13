import { useCallback } from 'react';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useTxModalPlaceOrder } from './modal-stages';
import { usePlaceOrderTxSender } from './tx-sender';
import { PlaceOrderFormInput, StonksMetadata } from '@stonks/types';
import { ActionArgs } from 'shared/types';

type Args = ActionArgs & {
  stonksMetadata: StonksMetadata;
};

export const usePlaceOrderAction = ({
  onConfirm,
  onRetry,
  stonksMetadata,
}: Args) => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalPlaceOrder();
  const sendPlaceOrderTx = usePlaceOrderTxSender(stonksMetadata);
  const waitForTx = useTxConfirmation();

  return useCallback(
    async (formData: PlaceOrderFormInput) => {
      try {
        const args = { ...formData, stonksMetadata };
        txModalStages.sign(args);

        const txHash = await sendPlaceOrderTx(args);

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(args, txHash);

        const response = await waitForTx(txHash);

        if (response.status === 'reverted') {
          txModalStages.failed(new Error(`Failed to place order`), onRetry);
        }

        txModalStages.success();
        await onConfirm?.();

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      stonksMetadata,
      txModalStages,
      isMultisig,
      sendPlaceOrderTx,
      waitForTx,
      onConfirm,
      onRetry,
    ],
  );
};
