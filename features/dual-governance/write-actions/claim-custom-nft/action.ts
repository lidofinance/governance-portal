import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useClaimCustomNftTxModal } from './modal-stages';
import { useClaimCustomNftTxSend } from './tx-sender';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { Address } from 'viem';

export const useClaimCustomNftAction = () => {
  const { data: isMultisig } = useIsContract();

  const { txModalStages } = useClaimCustomNftTxModal();

  const processClaimCustomNft = useClaimCustomNftTxSend();

  const waitForTx = useTxConfirmation();

  return useCallback(
    async (selectedNftIds: string[], escrowAddress: Address) => {
      try {
        invariant(selectedNftIds, 'NFT IDs are required');

        txModalStages.signStage(selectedNftIds);

        const txHash = await processClaimCustomNft(
          selectedNftIds,
          escrowAddress,
        );

        txModalStages.pendingStage(selectedNftIds);

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        await waitForTx(txHash);

        txModalStages.successStage({
          txHash,
          selectedNftIds,
        });
      } catch (error) {
        console.warn(error);
        console.warn(
          `Error executing 'execute' for NFT #${selectedNftIds}`,
          error,
        );
        txModalStages.failureStage();
        return false;
      }
    },
    [txModalStages, processClaimCustomNft, isMultisig, waitForTx],
  );
};
