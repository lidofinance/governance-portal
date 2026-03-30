import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { UseApproveResponse } from 'shared/blockchain/hooks/use-approve';
import { useTxModalSupport } from './modal-stages';
import { useAccount } from 'wagmi';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useEscrowContext } from 'providers/escrow';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import { EscrowActionArgs } from '@dg/types';
import { Token } from 'shared/blockchain/types';
import { ActionArgs } from 'shared/types';
import { useSupportVetoTxSender } from './tx-sender';
import { VisibleGovernanceState } from '@dg/types';
import { useConfirmModal } from 'shared/hooks/use-confirm-modal';
import { useRefetchEscrowData } from '@dg/hooks/use-refetch-escrow-data';

const SHOULD_CONVERT_SHARES = false;

type Args = {
  approveData: UseApproveResponse;
} & ActionArgs;

export const useSupportVetoAction = ({ approveData, onRetry }: Args) => {
  const { address } = useAccount();
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalSupport();
  const sendSupportVetoTx = useSupportVetoTxSender();
  const waitForTx = useTxConfirmation();
  const { vetoSignallingAddress } = useEscrowContext();
  const { visibleState, isAssetManagementLocked } =
    useDualGovernanceStateContext();
  const { approve, needsApprove } = approveData;

  const needsRQApprove =
    visibleState === VisibleGovernanceState.BlockedRageQuit;

  const { confirm } = useConfirmModal();
  const { refetchAll } = useRefetchEscrowData();

  return useCallback(
    async (args: EscrowActionArgs) => {
      try {
        invariant(address, 'address must be presented');
        invariant(
          vetoSignallingAddress,
          'VetoSignallingAddress must be defined',
        );

        if (isAssetManagementLocked) {
          throw new Error('Cannot support veto signalling in RageQuit state');
        }

        let approvalAmount;
        if (args.token === Token.unstETH) {
          approvalAmount = BigInt(Object.keys(args.selectedNftIds).length);
        } else {
          approvalAmount = args.amount;
        }

        invariant(approvalAmount, 'amount must be presented');

        const actionArgs = {
          token: args.token,
          amount: approvalAmount,
          selectedNftIds:
            args.token === Token.unstETH ? args.selectedNftIds : [],
          escrowAddress: vetoSignallingAddress,
        };
        const hasRQApprove = needsRQApprove
          ? await confirm({
              title: 'Warning: RageQuit is in Progress',
              description:
                'RageQuit is in progress. Depositing now may result in a long withdrawal times. Do you want to continue?',
              confirmText: 'Proceed',
              cancelText: 'Cancel',
            })
          : true;

        if (needsRQApprove && !hasRQApprove) {
          return true;
        }

        if (needsApprove) {
          txModalStages.signApproval(actionArgs, SHOULD_CONVERT_SHARES);

          await approve({
            onTxSent: (txHash) => {
              if (!isMultisig) {
                txModalStages.pendingApproval(
                  actionArgs,
                  txHash,
                  SHOULD_CONVERT_SHARES,
                );
              }
            },
          });
          if (isMultisig) {
            txModalStages.successMultisig();
            return true;
          }
        }

        txModalStages.sign(actionArgs, SHOULD_CONVERT_SHARES);

        const txHash = await sendSupportVetoTx(actionArgs);

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(actionArgs, txHash, SHOULD_CONVERT_SHARES);

        const response = await waitForTx(txHash);

        if (response.status === 'reverted') {
          txModalStages.failed(
            new Error('Failed to support, please, try again.'),
            onRetry,
          );
          return false;
        }

        txModalStages.success(actionArgs, txHash, SHOULD_CONVERT_SHARES);

        await refetchAll();

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      address,
      vetoSignallingAddress,
      isAssetManagementLocked,
      needsRQApprove,
      confirm,
      needsApprove,
      txModalStages,
      sendSupportVetoTx,
      isMultisig,
      waitForTx,
      refetchAll,
      approve,
      onRetry,
    ],
  );
};
