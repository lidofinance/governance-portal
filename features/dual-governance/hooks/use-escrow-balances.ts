import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { escrowAbi } from 'abi/ts';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { computeRageQuitEscrowsBalances } from '../utils';
import { useState } from 'react';
import { WstETH } from 'shared/blockchain/contracts';
import { useEscrowContext } from 'providers/escrow';

export const useEscrowBalances = () => {
  const { address: accountAddress } = useAccount();
  const [loadingState, setLoadingState] = useState(true);
  const { chainId } = useLidoSDK();
  const {
    vetoSignallingAddress,
    rageQuitAddress: currentRageQuitEscrowAddress,
    historicalEscrowAddresses,
  } = useEscrowContext();

  const readEscrowContract = useReadContractGetter(escrowAbi);
  const readWstEthContract = useReadContract(WstETH);

  const isEnabled =
    !!vetoSignallingAddress &&
    !!currentRageQuitEscrowAddress &&
    !!accountAddress;

  const queryClient = useQueryClient();

  useWatchContractEvent({
    address: vetoSignallingAddress,
    abi: escrowAbi,
    eventName: 'StETHSharesLocked',
    enabled: isEnabled,
    onLogs: () => {
      void queryClient.invalidateQueries({ queryKey: ['escrow-balances'] });
    },
  });

  useWatchContractEvent({
    address: vetoSignallingAddress,
    abi: escrowAbi,
    eventName: 'UnstETHLocked',
    enabled: isEnabled,
    onLogs: () => {
      void queryClient.invalidateQueries({ queryKey: ['escrow-balances'] });
    },
  });

  return useQuery({
    queryKey: [
      'escrow-balances',
      chainId,
      accountAddress,
      vetoSignallingAddress,
      currentRageQuitEscrowAddress,
      historicalEscrowAddresses,
    ],
    staleTime: 5000, // 5 seconds stale time
    enabled: isEnabled,
    queryFn: async () => {
      if (!isEnabled) {
        return null;
      }

      const readVetoSignallingContract = readEscrowContract(
        vetoSignallingAddress,
      );

      const minAssetLockDuration = await readVetoSignallingContract(
        'getMinAssetsLockDuration',
      );

      const vetoSignallingBalance = await readVetoSignallingContract(
        'getVetoerDetails',
        [accountAddress],
      );

      const vetoSignallingSum =
        vetoSignallingBalance.stETHLockedShares +
        vetoSignallingBalance.unstETHLockedShares;

      const computedRageQuitEscrowsBalances =
        await computeRageQuitEscrowsBalances({
          readEscrowContract,
          historicalEscrowAddresses,
          vetoSignallingAddress,
          accountAddress,
        });

      setLoadingState(false);

      const wstETHLockedShares = await readWstEthContract.readContract(
        'getStETHByWstETH',
        [vetoSignallingBalance.stETHLockedShares],
      );

      const totalStETHLockedSharesInRageQuitEscrows =
        computedRageQuitEscrowsBalances
          ? Object.values(computedRageQuitEscrowsBalances).reduce(
              (sum, balance) => sum + balance.totalStETHLockedShares,
              0n,
            )
          : 0n;

      const totalUnstETHLockedSharesInRageQuitEscrows =
        computedRageQuitEscrowsBalances
          ? Object.values(computedRageQuitEscrowsBalances).reduce(
              (sum, balance) => sum + balance.totalUnstETHLockedShares,
              0n,
            )
          : 0n;
      const totalLockedSharesInRageQuitEscrows =
        totalStETHLockedSharesInRageQuitEscrows +
        totalUnstETHLockedSharesInRageQuitEscrows;

      const assetUnlockTimestamp =
        vetoSignallingBalance.lastAssetsLockTimestamp + minAssetLockDuration;

      return {
        vetoSignallingBalance: {
          totalLockedShares: vetoSignallingSum,
          wstETHLockedShares,
          ...vetoSignallingBalance,
        },
        rageQuitsBalance: {
          totalLockedShares: totalLockedSharesInRageQuitEscrows,
          historicalBalances: computedRageQuitEscrowsBalances || {},
          totalStETHLockedSharesInRageQuitEscrows,
          totalUnstETHLockedSharesInRageQuitEscrows,
        },
        totalLockedSharesInEscrows:
          vetoSignallingSum + totalLockedSharesInRageQuitEscrows,
        assetUnlockTimestamp,
        isLoading: loadingState,
      };
    },
  });
};
