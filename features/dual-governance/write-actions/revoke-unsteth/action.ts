import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useAccount } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { ActionArgs } from '../types';
import { useRevokeUnstethTxModal } from './modal-stages';
import { useRevokeUnstethTxSend } from './tx-sender';
import { WithdrawalQueue } from 'shared/blockchain/contracts';

export const useRevokeUnstethAction = ({ onConfirm, onRetry }: ActionArgs) => {
  const { address } = useAccount();
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useRevokeUnstethTxModal();
  const processRevokeTx = useRevokeUnstethTxSend();
  const waitForTx = useTxConfirmation();
  const withdrawalQueue = useReadContract(WithdrawalQueue);
  const { isAssetManagementLocked } = useDualGovernanceContext();

  return useCallback(
    async (selectedNftIds: string[]) => {
      try {
        invariant(address, 'address must be presented');
        invariant(
          !isAssetManagementLocked,
          'Cannot support veto signalling in pending RageQuit state',
        );
        invariant(
          selectedNftIds.length > 0,
          'selectedNftIds must be presented',
        );

        txModalStages.sign(selectedNftIds);

        const txHash = await processRevokeTx(selectedNftIds);

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(selectedNftIds, txHash);

        await waitForTx(txHash);

        const [nftCount] = await Promise.all([
          withdrawalQueue.readContract('balanceOf', [address]),
          onConfirm(),
        ]);

        txModalStages.success(nftCount, txHash);
        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      address,
      isAssetManagementLocked,
      txModalStages,
      isMultisig,
      withdrawalQueue,
      onConfirm,
      processRevokeTx,
      waitForTx,
      onRetry,
    ],
  );
};
