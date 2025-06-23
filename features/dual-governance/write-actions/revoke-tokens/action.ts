import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useAccount } from 'wagmi';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { ActionArgs } from '../types';
import { useRevokeTokensModalStages } from './modal-stages';
import { useRevokeTokensTxSender } from './tx-sender';
import { EscrowActionArgs } from 'features/dual-governance/types';
import { Token } from 'shared/blockchain/types';
import { useRefetchEscrowData } from '../../hooks/use-refetch-escrow-data';

export const useRevokeTokensAction = ({ onConfirm, onRetry }: ActionArgs) => {
  const { address } = useAccount();
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useRevokeTokensModalStages();
  const sendRevokeTx = useRevokeTokensTxSender();
  const waitForTx = useTxConfirmation();
  const { refetchAll } = useRefetchEscrowData();

  return useCallback(
    async (args: EscrowActionArgs) => {
      try {
        invariant(address, 'address must be presented');
        // invariant(
        //   !isAssetManagementLocked,
        //   'Cannot support veto signalling in pending RageQuit state',
        // );
        if (args.token === Token.unstETH) {
          invariant(args.selectedNftIds.length > 0, 'ids must be presented');
        }

        txModalStages.sign(args);

        const txHash = await sendRevokeTx(args);

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(args, txHash);

        const response = await waitForTx(txHash);

        if (response.status === 'reverted') {
          txModalStages.failed(
            new Error('Failed to revoke, please, try again.'),
            onRetry,
          );
          return false;
        }
        txModalStages.success(args, txHash);
        await refetchAll();
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
      sendRevokeTx,
      isMultisig,
      waitForTx,
      refetchAll,
      onConfirm,
      onRetry,
    ],
  );
};
