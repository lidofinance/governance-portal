import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { UseApproveResponse } from 'shared/blockchain/hooks/use-approve';
import { useTxModalSupport } from './use-tx-modal-stages-support';
import { useSupportVetoTxSend } from './use-support-veto-tx-send';
import { Address } from 'viem';
import { SupportFormInputType } from './support-form-context';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { getTokenAddress } from 'shared/blockchain/get-contract-address';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useDualGovernanceContext } from 'providers/dual-governance';
import {
  GovernanceState,
  VisibleGovernanceState,
} from 'features/dual-governance/types';
import { Token } from 'shared/blockchain/types';
import { erc20Abi } from 'abi/ts';
import { useConfirmModal } from 'shared/hooks/use-confirm-modal';

type UseWrapFormProcessorArgs = {
  approveData: UseApproveResponse;
  escrowAddress: Address | undefined;
  onConfirm: () => Promise<void>;
  onRetry?: () => void;
};

export const useSupportFormProcessor = ({
  approveData,
  escrowAddress,
  onConfirm,
  onRetry,
}: UseWrapFormProcessorArgs) => {
  const { chainId } = useLidoSDK();
  const { address } = useAccount();
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalSupport();
  const processWrapTx = useSupportVetoTxSend(escrowAddress);
  const waitForTx = useTxConfirmation();
  const readTokenGetter = useReadContractGetter(erc20Abi);
  const { detailedState, visibleState } = useDualGovernanceContext();
  const { approve, needsApprove } = approveData;

  const needsRQApprove =
    visibleState === VisibleGovernanceState.BlockedRageQuit;

  const { confirm } = useConfirmModal();

  return useCallback(
    async ({ amount, token, selectedNftIds }: SupportFormInputType) => {
      try {
        invariant(address, 'address must be presented');
        invariant(detailedState, 'state must be loaded');

        if (
          detailedState.persistedState !== GovernanceState.RageQuit &&
          detailedState.effectiveState === GovernanceState.RageQuit
        ) {
          throw new Error('Cannot support veto signalling in RageQuit state');
        }

        let approvalAmount = amount;
        if (token === Token.unstETH) {
          approvalAmount = BigInt(Object.keys(selectedNftIds).length);
        }
        invariant(approvalAmount, 'amount must be presented');

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
          txModalStages.signApproval(approvalAmount, token);

          await approve({
            onTxSent: (txHash) => {
              if (!isMultisig) {
                txModalStages.pendingApproval(approvalAmount, token, txHash);
              }
            },
          });
          if (isMultisig) {
            txModalStages.successMultisig();
            return true;
          }
        }

        txModalStages.sign(approvalAmount, token);

        const txHash = await processWrapTx({
          amount,
          token,
          selectedNftIds,
        });

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(approvalAmount, token, txHash);

        await waitForTx(txHash);

        const tokenAddress = getTokenAddress(token, chainId);

        const [tokenBalance] = await Promise.all([
          readTokenGetter(tokenAddress)('balanceOf', [address]),
          onConfirm(),
        ]);

        txModalStages.success(tokenBalance, token, txHash);
        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      address,
      detailedState,
      needsApprove,
      txModalStages,
      processWrapTx,
      isMultisig,
      waitForTx,
      chainId,
      readTokenGetter,
      onConfirm,
      approve,
      onRetry,
    ],
  );
};
