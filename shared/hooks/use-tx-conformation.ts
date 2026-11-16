import { useCallback } from 'react';
import type { Hash } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useClient } from 'wagmi';
import { TxSentDataUnavailableError } from 'utils';

// helper hook until migration to wagmi is complete
// awaits TX trough wagmi transport to allow sync with balance hooks
export const useTxConfirmation = () => {
  const client = useClient();
  return useCallback(
    async (hash: string) => {
      try {
        return await waitForTransactionReceipt(client as any, {
          confirmations: 1,
          hash: hash as Hash,
        });
      } catch (error) {
        throw new TxSentDataUnavailableError(error);
      }
    },
    [client],
  );
};
