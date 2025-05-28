import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useClaimCustomNftTxModal } from './modal-stages';
import { useClaimCustomNftTxSend } from './tx-sender';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { WithdrawalQueue } from 'shared/blockchain/contracts';
import { useDualGovernanceContext } from 'providers/dual-governance';

export const useClaimCustomNftAction = () => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useClaimCustomNftTxModal();
  const processClaimCustomNft = useClaimCustomNftTxSend();
  const waitForTx = useTxConfirmation();
  const withdrawalQueueContract = useReadContract(WithdrawalQueue);
  const { historicalEscrowAddresses } = useDualGovernanceContext();

  return useCallback(
    async (selectedNftIds: string[]) => {
      try {
        invariant(selectedNftIds, 'NFT IDs are required');
        invariant(
          withdrawalQueueContract,
          'Withdrawal Queue contract is required',
        );
        invariant(
          historicalEscrowAddresses,
          'Historical escrow addresses are required',
        );

        // Verify the NFT owner is a valid RageQuit escrow address
        const nftStatus = await withdrawalQueueContract.readContract(
          'getWithdrawalStatus',
          [[BigInt(selectedNftIds[0])]],
        );

        if (!nftStatus || nftStatus.length === 0) {
          throw new Error('NFT not found');
        }

        const nftOwner = nftStatus[0].owner;

        // Verify the NFT owner is a RageQuit escrow address
        const isOwnerRageQuitEscrow = historicalEscrowAddresses.some(
          (escrowAddress) =>
            escrowAddress.toLowerCase() === nftOwner.toLowerCase(),
        );

        if (!isOwnerRageQuitEscrow) {
          throw new Error('NFT owner is not a RageQuit escrow address');
        }

        const escrowAddress = nftOwner;

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

        return true;
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
    [
      txModalStages,
      processClaimCustomNft,
      isMultisig,
      waitForTx,
      withdrawalQueueContract,
      historicalEscrowAddresses,
    ],
  );
};
