import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { dgEscrowAbi } from 'abi/generated';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { useState } from 'react';
import { useEscrowContext } from 'providers/escrow';
import { Address } from 'viem';
import { UnstETHRecordStatus } from '../types';

export type RageQuitEscrowUnstETHRecord = {
  id: bigint;
  status: UnstETHRecordStatus;
  lockedBy: `0x${string}`;
  shares: bigint;
  claimableAmount: bigint;
};

export type EscrowBalance = {
  escrowAddress: Address;
  stETHLockedShares: bigint;
  unstETHLockedShares: bigint;
  totalLockedShares: bigint;
  lastAssetsLockTimestamp: number;
  unstETHIdsCount: bigint;
  activeUnstethRecords: RageQuitEscrowUnstETHRecord[];
};

export const useEscrowBalances = () => {
  const { address: accountAddress } = useAccount();
  const [loadingState, setLoadingState] = useState(true);
  const { chainId } = useLidoSDK();
  const { vetoSignallingAddress, historicalEscrowAddresses } =
    useEscrowContext();

  const readEscrowContract = useReadContractGetter(dgEscrowAbi);

  const isEnabled =
    !!accountAddress && !!readEscrowContract && !!vetoSignallingAddress;

  const queryClient = useQueryClient();

  useWatchContractEvent({
    address: vetoSignallingAddress,
    abi: dgEscrowAbi,
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
    abi: dgEscrowAbi,
    eventName: 'UnstETHLocked',
    enabled: isEnabled,
    onLogs: () => {
      void queryClient.invalidateQueries({ queryKey: ['escrow-balances'] });
      void queryClient.invalidateQueries({
        queryKey: ['rage-quit-escrow-balances'],
      });
    },
  });

  return useQuery({
    queryKey: [
      'escrow-balances',
      accountAddress,
      vetoSignallingAddress,
      historicalEscrowAddresses,
      chainId,
    ],
    staleTime: 5000, // 5 seconds stale time
    enabled: isEnabled,
    queryFn: async () => {
      if (!isEnabled || !vetoSignallingAddress) {
        return {
          escrowBalances: [],
          totalLockedSharesInEscrows: 0n,
          assetUnlockTimestamp: 0,
          isLoading: false,
        };
      }

      const readVetoSignallingContract = readEscrowContract(
        vetoSignallingAddress,
      );

      const minAssetsLockDuration = await readVetoSignallingContract(
        'getMinAssetsLockDuration',
      );

      // Collect all escrow addresses to process (current veto signalling + historical)
      const allEscrowAddresses: Address[] = [];

      if (
        vetoSignallingAddress &&
        !historicalEscrowAddresses?.some(
          (address) =>
            address.toLowerCase() === vetoSignallingAddress.toLowerCase(),
        )
      ) {
        allEscrowAddresses.push(vetoSignallingAddress);
      }

      if (historicalEscrowAddresses && historicalEscrowAddresses.length > 0) {
        allEscrowAddresses.push(...historicalEscrowAddresses);
      }

      // Process all escrow addresses in a single batch
      const escrowBalances = await Promise.all(
        allEscrowAddresses.map(async (address) => {
          try {
            const escrowContract = readEscrowContract(address);
            const details = await escrowContract('getVetoerDetails', [
              accountAddress,
            ]);

            const unstETHIds = await escrowContract('getVetoerUnstETHIds', [
              accountAddress,
            ]);

            let unstETHDetails: readonly any[] = [];
            if (Array.isArray(unstETHIds) && unstETHIds.length > 0) {
              unstETHDetails = await escrowContract('getLockedUnstETHDetails', [
                unstETHIds,
              ]);
            }

            // Filter out withdrawn records
            const activeUnstethRecords = Array.isArray(unstETHDetails)
              ? unstETHDetails.filter(
                  (record) =>
                    record && record.status !== UnstETHRecordStatus.Withdrawn,
                )
              : [];

            return {
              escrowAddress: address,
              ...details,
              totalLockedShares:
                details.stETHLockedShares +
                activeUnstethRecords.reduce(
                  (sum, record) => sum + record.shares,
                  0n,
                ),
              unstETHIdsCount: details.unstETHIdsCount || 0n,
              activeUnstethRecords,
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
              activeUnstethRecords: [],
            };
          }
        }),
      );

      const escrowSum = escrowBalances.reduce(
        (sum: bigint, balance) => sum + balance.totalLockedShares,
        0n,
      );

      setLoadingState(false);

      const currentVetoSignallingEscrowBalance = escrowBalances.find(
        (balance) =>
          balance.escrowAddress.toLowerCase() ===
          vetoSignallingAddress.toLowerCase(),
      );

      const assetUnlockTimestamp =
        currentVetoSignallingEscrowBalance &&
        currentVetoSignallingEscrowBalance.lastAssetsLockTimestamp
          ? Number(currentVetoSignallingEscrowBalance.lastAssetsLockTimestamp) +
            Number(minAssetsLockDuration)
          : 0;

      return {
        escrowBalances,
        totalLockedSharesInEscrows: escrowSum,
        assetUnlockTimestamp,
        isLoading: loadingState,
      };
    },
  });
};
