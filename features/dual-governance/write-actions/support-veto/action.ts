import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { UseApproveResponse } from 'shared/blockchain/hooks/use-approve';
import { useTxModalSupport } from './modal-stages';
import { useAccount } from 'wagmi';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { EscrowActionArgs } from 'features/dual-governance/types';
import { Token } from 'shared/blockchain/types';
import { ActionArgs } from '../types';
import { useSupportVetoTxSender } from './tx-sender';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { useConfirmModal } from 'shared/hooks/use-confirm-modal';
import { useRefetchEscrowData } from '../../hooks/use-refetch-escrow-data';

type Args = {
  approveData: UseApproveResponse;
} & ActionArgs;

export const useSupportVetoAction = ({ approveData, onRetry }: Args) => {
  const { address } = useAccount();
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalSupport();
  const sendSupportVetoTx = useSupportVetoTxSender();
  const waitForTx = useTxConfirmation();
  const { isAssetManagementLocked, vetoSignallingAddress } =
    useDualGovernanceContext();
  const { visibleState } = useDualGovernanceContext();
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
          txModalStages.signApproval(actionArgs);

          await approve({
            onTxSent: (txHash) => {
              if (!isMultisig) {
                txModalStages.pendingApproval(actionArgs, txHash);
              }
            },
          });
          if (isMultisig) {
            txModalStages.successMultisig();
            return true;
          }
        }

        txModalStages.sign(actionArgs);

        const txHash = await sendSupportVetoTx(actionArgs);

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(actionArgs, txHash);

        await waitForTx(txHash);

        txModalStages.success(actionArgs, txHash);

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
