import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { UseApproveResponse } from 'shared/blockchain/hooks/use-approve';
import { useTxModalSupport } from './modal-stages';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { getTokenAddress } from 'shared/blockchain/get-contract-address';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { EscrowActionArgs } from 'features/dual-governance/types';
import { Token } from 'shared/blockchain/types';
import { erc20Abi } from 'abi/ts';
import { ActionArgs } from '../types';
import { useSupportVetoTxSender } from './tx-sender';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { useConfirmModal } from 'shared/hooks/use-confirm-modal';

type Args = {
  approveData: UseApproveResponse;
} & ActionArgs;

export const useSupportVetoAction = ({
  approveData,
  onConfirm,
  onRetry,
}: Args) => {
  const { chainId } = useLidoSDK();
  const { address } = useAccount();
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalSupport();
  const sendSupportVetoTx = useSupportVetoTxSender();
  const waitForTx = useTxConfirmation();
  const readTokenGetter = useReadContractGetter(erc20Abi);
  const { isAssetManagementLocked } = useDualGovernanceContext();
  const { visibleState } = useDualGovernanceContext();
  const { approve, needsApprove } = approveData;

  const needsRQApprove =
    visibleState === VisibleGovernanceState.BlockedRageQuit;

  const { confirm } = useConfirmModal();

  return useCallback(
    async (args: EscrowActionArgs) => {
      try {
        invariant(address, 'address must be presented');

        if (isAssetManagementLocked) {
          throw new Error('Cannot support veto signalling in RageQuit state');
        }

        let approvalAmount = BigInt(0);
        if (args.token === Token.unstETH) {
          approvalAmount = BigInt(Object.keys(args.ids).length);
        } else {
          approvalAmount = args.amount;
        }
        invariant(approvalAmount, 'amount must be presented');

        const actionArgs = {
          token: args.token,
          amount: approvalAmount,
          ids: args.token === Token.unstETH ? args.ids : [],
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

        const tokenAddress = getTokenAddress(args.token, chainId);

        const [tokenBalance] = await Promise.all([
          readTokenGetter(tokenAddress)('balanceOf', [address]),
          onConfirm(),
        ]);

        txModalStages.success(actionArgs, txHash, tokenBalance);
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
      needsRQApprove,
      needsApprove,
      txModalStages,
      isMultisig,
      chainId,
      readTokenGetter,
      onConfirm,
      approve,
      sendSupportVetoTx,
      confirm,
      waitForTx,
      onRetry,
    ],
  );
};
