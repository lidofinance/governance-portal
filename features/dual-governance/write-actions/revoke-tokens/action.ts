import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useAccount } from 'wagmi';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { ActionArgs } from '../types';
import { useRevokeTokensModalStages } from './modal-stages';
import { useRevokeTokensTxSender } from './tx-sender';
import { EscrowActionArgs } from 'features/dual-governance/types';
import { Token } from 'shared/blockchain/types';
import { getTokenAddress } from 'shared/blockchain/get-contract-address';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { erc20Abi } from 'abi/ts';

export const useRevokeTokensAction = ({ onConfirm, onRetry }: ActionArgs) => {
  const { chainId } = useLidoSDK();
  const { address } = useAccount();
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useRevokeTokensModalStages();
  const sendRevokeTx = useRevokeTokensTxSender();
  const waitForTx = useTxConfirmation();
  const readTokenGetter = useReadContractGetter(erc20Abi);
  const { isAssetManagementLocked } = useDualGovernanceContext();

  return useCallback(
    async (args: EscrowActionArgs) => {
      try {
        invariant(address, 'address must be presented');
        invariant(
          !isAssetManagementLocked,
          'Cannot support veto signalling in pending RageQuit state',
        );
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

        await waitForTx(txHash);

        const tokenAddress = getTokenAddress(args.token, chainId);

        const [tokenBalance] = await Promise.all([
          readTokenGetter(tokenAddress)('balanceOf', [address]),
        ]);

        txModalStages.success(args, txHash, tokenBalance);

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
      isAssetManagementLocked,
      txModalStages,
      sendRevokeTx,
      isMultisig,
      waitForTx,
      chainId,
      readTokenGetter,
      onConfirm,
      onRetry,
    ],
  );
};
