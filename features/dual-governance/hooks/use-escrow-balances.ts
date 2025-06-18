import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { escrowAbi } from 'abi/ts';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { useState } from 'react';
import { WstETH } from 'shared/blockchain/contracts';
import { useEscrowContext } from 'providers/escrow';
import { useRageQuitEscrowBalances } from './use-rage-quit-escrow-balances';

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
      void queryClient.invalidateQueries({
        queryKey: ['rage-quit-escrow-balances'],
      });
    },
  });

  useWatchContractEvent({
    address: vetoSignallingAddress,
    abi: escrowAbi,
    eventName: 'UnstETHLocked',
    enabled: isEnabled,
    onLogs: () => {
      void queryClient.invalidateQueries({ queryKey: ['escrow-balances'] });
      void queryClient.invalidateQueries({
        queryKey: ['rage-quit-escrow-balances'],
      });
    },
  });

  const {
    data: computedRageQuitEscrowsBalances,
    isLoading: isRageQuitLoading,
  } = useRageQuitEscrowBalances({
    historicalEscrowAddresses,
    vetoSignallingAddress,
    accountAddress,
    enabled: isEnabled,
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

      const vetoSignallingBalances = [
        {
          escrowAddress: vetoSignallingAddress,
          ...vetoSignallingBalance,
          totalLockedShares:
            vetoSignallingBalance.stETHLockedShares +
            vetoSignallingBalance.unstETHLockedShares,
          unstETHIdsCount: vetoSignallingBalance.unstETHIdsCount || 0n,
        },
      ];

      const historicalVetoerDetailsWithAddresses = await Promise.all(
        (historicalEscrowAddresses || []).map(async (address) => {
          try {
            const escrowContract = readEscrowContract(address);
            const details = await escrowContract('getVetoerDetails', [
              accountAddress,
            ]);
            return {
              escrowAddress: address,
              ...details,
              totalLockedShares:
                details.stETHLockedShares + details.unstETHLockedShares,
              unstETHIdsCount: details.unstETHIdsCount || 0n,
            };
          } catch (error) {
            console.warn(`Error getting vetoer details for ${address}:`, error);
            return {
              escrowAddress: address,
              stETHLockedShares: 0n,
              unstETHLockedShares: 0n,
              totalLockedShares: 0n,
              lastAssetsLockTimestamp: 0,
              unstETHIdsCount: 0n,
            };
          }
        }),
      );

      vetoSignallingBalances.push(...historicalVetoerDetailsWithAddresses);

      const vetoSignallingSum = vetoSignallingBalances.reduce(
        (sum, balance) => sum + balance.totalLockedShares,
        0n,
      );

      setLoadingState(false);

      // Calculate wstETHLockedShares for the main veto signaling balance
      const mainVetoBalance = vetoSignallingBalances.find(
        (balance) => balance.escrowAddress === vetoSignallingAddress,
      );

      const wstETHLockedShares = mainVetoBalance
        ? await readWstEthContract.readContract('getStETHByWstETH', [
            mainVetoBalance.stETHLockedShares,
          ])
        : 0n;

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
        mainVetoBalance && mainVetoBalance.lastAssetsLockTimestamp
          ? Number(mainVetoBalance.lastAssetsLockTimestamp) +
            Number(minAssetLockDuration)
          : 0;

      return {
        vetoSignallingBalances,
        wstETHLockedShares,
        rageQuitsBalance: {
          totalLockedShares: totalLockedSharesInRageQuitEscrows,
          historicalBalances: computedRageQuitEscrowsBalances || {},
          totalStETHLockedSharesInRageQuitEscrows,
          totalUnstETHLockedSharesInRageQuitEscrows,
        },
        totalLockedSharesInEscrows:
          vetoSignallingSum + totalLockedSharesInRageQuitEscrows,
        assetUnlockTimestamp,
        isLoading: loadingState || isRageQuitLoading,
      };
    },
  });
};
