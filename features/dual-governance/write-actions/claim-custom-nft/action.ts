import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useClaimCustomNftTxModal } from './modal-stages';
// import { useClaimCustomNftTxSend } from './tx-sender';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';

export const useClaimCustomNftAction = () => {
  const { data: isMultisig } = useIsContract();

  const { txModalStages } = useClaimCustomNftTxModal();

  // const processClaimCustomNft = useClaimCustomNftTxSend();

  const waitForTx = useTxConfirmation();

  return useCallback(
    async (nftId: number) => {
      try {
        invariant(nftId, 'NFT ID is required');

        txModalStages.signStage(nftId);

        // const txHash = await processClaimCustomNft(nftId);

        const txHash = '';

        txModalStages.pendingStage(nftId);

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        await waitForTx(txHash);

        txModalStages.successStage({
          txHash,
          nftId,
        });
      } catch (error) {
        console.warn(error);
        console.warn(`Error executing 'execute' for NFT #${nftId}`, error);
        txModalStages.failureStage();
        return false;
      }
    },
    [txModalStages, isMultisig, waitForTx],
  );
};
