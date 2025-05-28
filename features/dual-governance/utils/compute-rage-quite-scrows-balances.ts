import invariant from 'tiny-invariant';
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

type Props = {
  readEscrowContract: ReturnType<
    typeof useReadContractGetter<typeof escrowAbi>
  >;
  historicalEscrowAddresses: Address[] | null | undefined;
  vetoSignallingAddress: Address;
  accountAddress: Address;
};

type ComputeRageQuitEscrowsBalancesReturnType = Promise<Record<
  Address,
  {
    unstETHRecords: readonly RageQuitEscrowUnstETHRecord[];
    totalStETHLockedShares: bigint;
    totalUnstETHLockedShares: bigint;
    totalLockedShares: bigint;
  }
> | null>;

/**
 * This util is to get the list of all Rage Quit addresses and their balances
 * Important to note, due to the way the lockedUnstETH value is being updated in the Escrow contract, we cannot rely on it when computing the balances.
 * Hence, we have a workaraound to get the right unstETH amount locked
 *
 * 1) Get all the RQ escrow addresses;
 * 2) Get all the Vetoer unstETH ids in each of the RQ escrow addresses;
 * 3) Get unstETH ids details using getLockedUnstETHDetails([ids]);
 * 4) Filter all the Ids in the "Withdrawn" status, as we don't need to count their values;
 * 5) Sum up the locker unstETH shares for the rest of IDs
 *
 * Then in a component we can filter RQ records based on the totalLockedShares and track unstETH ids statuses for conditional rendering
 */

export const computeRageQuitEscrowsBalances = async ({
  readEscrowContract,
  historicalEscrowAddresses,
  vetoSignallingAddress,
  accountAddress,
}: Props): ComputeRageQuitEscrowsBalancesReturnType => {
  invariant(historicalEscrowAddresses, 'Escrow addresses must be provided');

  // The escrow addresses list contains 1 VS address and the rest are RQ addresses
  const rageQuitEscrowAddresses = historicalEscrowAddresses.filter(
    (address) => address.toLowerCase() !== vetoSignallingAddress.toLowerCase(),
  );

  if (rageQuitEscrowAddresses.length === 0) {
    return null;
  }

  const balancePromises = rageQuitEscrowAddresses.map(async (address) => {
    const vetoerDetails = (await readEscrowContract(address)(
      'getVetoerDetails',
      [accountAddress],
    )) || {
      unstETHIdsCount: 0n,
      stETHLockedShares: 0n,
      unstETHLockedShares: 0n,
    };

    return { rageQuitEscrowAddress: address, vetoerDetails };
  });

  const escrowBalances = await Promise.all(balancePromises);

  const detailedEscrowBalances = await Promise.all(
    escrowBalances.map(async (balanceRecord) => {
      const rageQuitUnstETHIds = await readEscrowContract(
        balanceRecord.rageQuitEscrowAddress,
      )('getVetoerUnstETHIds', [accountAddress]);

      const rageQuitLockedUnstETHDetails = await readEscrowContract(
        balanceRecord.rageQuitEscrowAddress,
      )('getLockedUnstETHDetails', [rageQuitUnstETHIds]);

      return { ...balanceRecord, rageQuitLockedUnstETHDetails };
    }),
  );
  return detailedEscrowBalances.reduce(
    (acc: Record<Address, EscrowBalanceDetails>, balanceRecord) => {
      const unstETHRecords = balanceRecord.rageQuitLockedUnstETHDetails.filter(
        (record: any) => record.status !== UnstETHRecordStatus.Withdrawn,
      );

      const totalStETHLockedShares =
        balanceRecord.vetoerDetails.stETHLockedShares;
      const totalUnstETHLockedShares = unstETHRecords.reduce(
        (sum: bigint, record: any) => sum + record.shares,
        0n,
      );
      const totalLockedShares =
        totalStETHLockedShares + totalUnstETHLockedShares;

      acc[balanceRecord.rageQuitEscrowAddress] = {
        unstETHRecords,
        totalStETHLockedShares,
        totalUnstETHLockedShares,
        totalLockedShares,
      };

      return acc;
    },
    {} as Record<Address, EscrowBalanceDetails>,
  );
};
