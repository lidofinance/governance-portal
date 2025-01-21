import { escrowAbi } from 'abi/ts';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { VisibleGovernanceState } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';

export const useRageQuitEscrowDetails = () => {
  const { chainId } = useLidoSDK();
  const { rageQuitAddress, visibleState } = useDualGovernanceContext();

  const readEscrowContract = useReadContractGetter(escrowAbi);

  const isEnabled =
    !!rageQuitAddress &&
    visibleState === VisibleGovernanceState.BlockedRageQuit;

  return useQuery({
    queryKey: ['rage-quit-details', chainId],
    enabled: isEnabled,
    staleTime: 300_000, // 5 minutes
    queryFn: async () => {
      if (!isEnabled) return;

      const rageQuitDetails = await readEscrowContract(rageQuitAddress)(
        'getRageQuitEscrowDetails',
      );

      const {
        isRageQuitExtensionPeriodStarted,
        rageQuitExtensionPeriodStartedAt,
        rageQuitExtensionPeriodDuration,
        rageQuitEthWithdrawalsDelay,
      } = rageQuitDetails;

      let withdrawalsUnlockTimestamp: number | null = null;

      if (isRageQuitExtensionPeriodStarted) {
        const ethWithdrawalsDelay =
          rageQuitExtensionPeriodDuration + rageQuitEthWithdrawalsDelay;

        withdrawalsUnlockTimestamp =
          ethWithdrawalsDelay + rageQuitExtensionPeriodStartedAt;
      }

      return { ...rageQuitDetails, withdrawalsUnlockTimestamp };
    },
  });
};
