import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useScheduleProposalTxModal } from './modal-stages';
import { useScheduleProposalTxSend } from './tx-sender';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { ActionArgs } from '../types';

export const useScheduleProposalAction = ({ onConfirm }: ActionArgs) => {
  const { data: isMultisig } = useIsContract();

  const { txModalStages } = useScheduleProposalTxModal();

  const processScheduleProposal = useScheduleProposalTxSend();
  const waitForTx = useTxConfirmation();

  return useCallback(
    async (id: number) => {
      try {
        invariant(id, 'Proposal ID is required');

        txModalStages.pendingStage(id);

        const txHash = await processScheduleProposal(id);

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        await waitForTx(txHash);

        await onConfirm();

        txModalStages.successStage({
          txHash,
          proposalId: id,
        });
      } catch (error) {
        console.warn(error);
        console.warn(
          `Error executing 'scheduleProposal' for proposal: ${id}`,
          error,
        );
        txModalStages.failureStage();
        return false;
      }
    },
    [txModalStages, isMultisig, processScheduleProposal, waitForTx, onConfirm],
  );
};
