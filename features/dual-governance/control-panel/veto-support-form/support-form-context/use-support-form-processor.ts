import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { UseApproveResponse } from 'shared/blockchain/hooks/use-approve';
import { useTxModalSupport } from './use-tx-modal-stages-support';
import { useSupportVetoTxSend } from './use-support-veto-tx-send';
import { Address, erc20Abi } from 'viem';
import { SupportFormInputType } from './support-form-context';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { getTokenAddress } from 'shared/blockchain/get-contract-address';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { GovernanceState } from 'features/dual-governance/types';

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
  const { detailedState } = useDualGovernanceContext();
  const { approve, needsApprove } = approveData;

  return useCallback(
    async ({ amount, token }: SupportFormInputType) => {
      try {
        invariant(amount, 'amount must be presented');
        invariant(address, 'address must be presented');
        invariant(detailedState, 'state must be loaded');

        if (
          detailedState.persistedState !== GovernanceState.RageQuit &&
          detailedState.effectiveState === GovernanceState.RageQuit
        ) {
          throw new Error('Cannot support veto signalling in RageQuit state');
        }

        if (needsApprove) {
          txModalStages.signApproval(amount, token);

          await approve({
            onTxSent: (txHash) => {
              if (!isMultisig) {
                txModalStages.pendingApproval(amount, token, txHash);
              }
            },
          });
          if (isMultisig) {
            txModalStages.successMultisig();
            return true;
          }
        }

        txModalStages.sign(amount, token);

        const txHash = await processWrapTx({ amount, token });

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(amount, token, txHash);

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
