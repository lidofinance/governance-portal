import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { getTokenAddress } from 'shared/blockchain/get-contract-address';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useTxModalRevoke } from './use-tx-modal-stages-revoke';
import { useRevokeTxSend } from './use-revoke-tx-send';
import { erc20Abi } from 'abi/ts';
import { Token } from 'shared/blockchain/types';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { GovernanceState } from 'features/dual-governance/types';

type Args = {
  onConfirm: () => Promise<void>;
  onRetry?: () => void;
};

export const useRevocationPanelProcessor = ({ onConfirm, onRetry }: Args) => {
  const { chainId } = useLidoSDK();
  const { address } = useAccount();
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalRevoke();
  const { vetoSignallingAddress, detailedState } = useDualGovernanceContext();
  const processWrapTx = useRevokeTxSend(vetoSignallingAddress);
  const waitForTx = useTxConfirmation();
  const readTokenGetter = useReadContractGetter(erc20Abi);

  return useCallback(
    async ({ amount, token }: { amount: bigint; token: Token }) => {
      try {
        invariant(address, 'address must be presented');
        invariant(detailedState, 'state must be loaded');

        if (
          detailedState.persistedState !== GovernanceState.RageQuit &&
          detailedState.effectiveState === GovernanceState.RageQuit
        ) {
          throw new Error('Cannot revoke tokens in RageQuit state');
        }

        txModalStages.sign(amount, token);

        const txHash = await processWrapTx(token);

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
      txModalStages,
      processWrapTx,
      isMultisig,
      waitForTx,
      chainId,
      readTokenGetter,
      onConfirm,
      onRetry,
    ],
  );
};
