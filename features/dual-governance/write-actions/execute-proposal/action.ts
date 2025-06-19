import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useExecuteProposalTxSend } from './tx-sender';
import { useEmergencyExecuteProposalTxSend } from './emergency-tx-sender';
import { useExecuteProposalTxModal } from './modal-stages';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';

type ActionArgs = {
  onConfirm: () => Promise<void>;
  isEmergencyMode?: boolean;
};

export const useExecuteProposalAction = ({
  onConfirm,
  isEmergencyMode = false,
}: ActionArgs) => {
  const { data: isMultisig } = useIsContract();

  const { txModalStages } = useExecuteProposalTxModal();

  const processExecuteProposal = useExecuteProposalTxSend();
  const processEmergencyExecuteProposal = useEmergencyExecuteProposalTxSend();
  const waitForTx = useTxConfirmation();

  return useCallback(
    async (id: number) => {
      try {
        invariant(id, 'Proposal ID is required');

        txModalStages.signStage(id);

        const txHash = isEmergencyMode
          ? await processEmergencyExecuteProposal(id)
          : await processExecuteProposal(id);

        txModalStages.pendingStage({ txHash, proposalId: id });

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        const response = await waitForTx(txHash);

        if (response.status === 'reverted') {
          txModalStages.failureStage();
          return false;
        }

        await onConfirm();

        txModalStages.successStage({
          txHash,
          proposalId: id,
        });
      } catch (error) {
        console.warn(error);
        console.warn(`Error executing 'execute' for proposal: ${id}`, error);
        txModalStages.failureStage();
        return false;
      }
    },
    [
      txModalStages,
      isMultisig,
      processExecuteProposal,
      processEmergencyExecuteProposal,
      isEmergencyMode,
      waitForTx,
      onConfirm,
    ],
  );
};
