import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { escrowAbi } from 'abi/ts';
import { UnstETHRecordStatus } from '../types';

export type RageQuitEscrowUnstETHRecord = {
  id: bigint;
  status: UnstETHRecordStatus;
  lockedBy: `0x${string}`;
  shares: bigint;
  claimableAmount: bigint;
};

type EscrowBalanceDetails = {
  unstETHRecords: readonly RageQuitEscrowUnstETHRecord[];
  totalStETHLockedShares: bigint;
  totalUnstETHLockedShares: bigint;
  totalLockedShares: bigint;
};

type UseRageQuitEscrowBalancesProps = {
  historicalEscrowAddresses: Address[] | null | undefined;
  vetoSignallingAddress: Address | undefined;
  accountAddress: Address | undefined;
  enabled?: boolean;
};

/**
 * Important to note, due to the way the lockedUnstETH value is being updated in the Escrow contract,
 * we cannot rely on it when computing the balances.
 */
export const useRageQuitEscrowBalances = ({
  historicalEscrowAddresses,
  vetoSignallingAddress,
  accountAddress,
  enabled = true,
}: UseRageQuitEscrowBalancesProps) => {
  const readEscrowContract = useReadContractGetter(escrowAbi);

  return useQuery({
    queryKey: [
      'rage-quit-escrow-balances',
      accountAddress,
      vetoSignallingAddress,
      historicalEscrowAddresses,
    ],
    enabled:
      enabled &&
      !!accountAddress &&
      !!vetoSignallingAddress &&
      !!historicalEscrowAddresses,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff with max 30s
    staleTime: 30000, // 30 seconds

    queryFn: async () => {
      if (
        !historicalEscrowAddresses ||
        !vetoSignallingAddress ||
        !accountAddress
      ) {
        return null;
      }

      // The escrow addresses list contains 1 VS address and the rest are RQ addresses
      const rageQuitEscrowAddresses = historicalEscrowAddresses.filter(
        (address) =>
          address.toLowerCase() !== vetoSignallingAddress.toLowerCase(),
      );

      if (rageQuitEscrowAddresses.length === 0) {
        return null;
      }

      try {
        const result: Record<Address, EscrowBalanceDetails> = {};

        // Process each escrow address
        for (const address of rageQuitEscrowAddresses) {
          const vetoerDetails = await readEscrowContract(address)(
            'getVetoerDetails',
            [accountAddress],
          ).catch(() => ({ stETHLockedShares: 0n, unstETHLockedShares: 0n }));

          let unstETHIds: any[] = [];
          try {
            const ids = await readEscrowContract(address)(
              'getVetoerUnstETHIds',
              [accountAddress],
            );
            unstETHIds = Array.isArray(ids) ? ids : [];
          } catch (error) {
            console.warn(`Error getting unstETH IDs for ${address}:`, error);
            unstETHIds = [];
          }

          let unstETHDetails: any[] = [];
          if (unstETHIds && unstETHIds.length > 0) {
            try {
              const details = await readEscrowContract(address)(
                'getLockedUnstETHDetails',
                [unstETHIds],
              );
              unstETHDetails = Array.isArray(details) ? details : [];
            } catch (error) {
              console.warn(
                `Error getting unstETH details for ${address}:`,
                error,
              );
              unstETHDetails = [];
            }
          }

          // Filter out withdrawn records
          const activeRecords = unstETHDetails.filter(
            (record) =>
              record && record.status !== UnstETHRecordStatus.Withdrawn,
          );

          const totalStETHLockedShares = vetoerDetails?.stETHLockedShares || 0n;
          const totalUnstETHLockedShares = activeRecords.reduce(
            (sum, record) => sum + (record?.shares || 0n),
            0n,
          );

          result[address] = {
            unstETHRecords: activeRecords,
            totalStETHLockedShares,
            totalUnstETHLockedShares,
            totalLockedShares:
              totalStETHLockedShares + totalUnstETHLockedShares,
          };
        }

        return result;
      } catch (error) {
        console.error('Failed to compute rage quit escrow balances:', error);
        throw error; // Let React Query handle the retry
      }
    },
  });
};
