import { Text } from 'shared/components/text';
import { RevocableTokensList } from './style';
import { RevocableTokenItem } from './revocable-token-item';
import { Token } from 'shared/blockchain/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import invariant from 'tiny-invariant';
import { useWithdrawEthAction } from 'features/dual-governance/write-actions/withdraw-eth';
import { useRageQuitEscrowDetails } from 'features/dual-governance/hooks/use-rage-quit-escrow-details';
import { useCountdown } from 'shared/hooks/use-countdown';
import { useSelectUnstethModal } from 'features/dual-governance/modals/modal-manager';
import { Box } from 'shared/components/box';
import { Address } from 'viem';
import { RageQuitEscrowUnstETHRecord } from '../../utils';
import { Link } from '@lidofinance/lido-ui';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { useLidoSDK } from 'providers/lido-sdk';
import { ExternalLinkIcon } from 'shared/components/icons';
import { UnstETHRecordStatus } from '../../types';

type RageQuitBalance = {
  rageQuitEscrowAddress: Address;
  totalStETHLockedShares?: bigint | undefined;
  totalUnstETHLockedShares?: bigint | undefined;
  unstETHRecords: readonly RageQuitEscrowUnstETHRecord[];
  totalLockedShares: bigint;
};

type Props = {
  onConfirm: () => Promise<void>;
  rageQuitBalance: RageQuitBalance;
  claimNFTs: (
    selectedNftIds: string[],
    escrowAddress: Address,
  ) => Promise<boolean | undefined>;
  withdrawalQueueContract: any;
};

const sumUpUnstETHShares = (records: RageQuitEscrowUnstETHRecord[]) =>
  records.reduce((sum, record) => sum + record.shares, 0n);

export const RageQuitTokens = ({
  rageQuitBalance,
  onConfirm,
  claimNFTs,
  withdrawalQueueContract,
}: Props) => {
  const { chainId } = useLidoSDK();

  const {
    totalStETHLockedShares,
    totalLockedShares,
    unstETHRecords,
    rageQuitEscrowAddress,
  } = rageQuitBalance;

  const [resolvedRecords, setResolvedRecords] = useState<
    RageQuitEscrowUnstETHRecord[]
  >([]);

  useEffect(() => {
    if (unstETHRecords.length === 0) {
      setResolvedRecords([]);
      return;
    }
    let cancelled = false;
    const fetchRecords = async () => {
      const records = await Promise.all(
        unstETHRecords.map(async (record) => {
          try {
            const nftStatus = await withdrawalQueueContract.readContract(
              'getWithdrawalStatus',
              [[BigInt(record.id)]],
            );

            let status: UnstETHRecordStatus;
            const statusObj = nftStatus[0];
            if (statusObj.isClaimed) {
              status = UnstETHRecordStatus.Claimed;
            } else if (statusObj.isFinalized) {
              status = UnstETHRecordStatus.Finalized;
            } else {
              status = UnstETHRecordStatus.Locked;
            }

            return {
              ...record,
              status,
            };
          } catch (error) {
            console.error(
              `Failed to fetch status for NFT ID ${record.id}:`,
              error,
            );
            return record;
          }
        }),
      );
      if (!cancelled) setResolvedRecords(records);
    };
    void fetchRecords();
    return () => {
      cancelled = true;
    };
  }, [unstETHRecords, withdrawalQueueContract]);

  const claimedUnstETHRecords = resolvedRecords.filter(
    (record) => record.status === UnstETHRecordStatus.Claimed,
  );

  const claimableUnstETHRecords = resolvedRecords.filter(
    (record) => record.status === UnstETHRecordStatus.Finalized,
  );

  const inWithdrawalQueueUnstETHRecords = resolvedRecords.filter(
    (record) => record.status === UnstETHRecordStatus.Locked,
  );

  const { openModal } = useSelectUnstethModal();

  const withdrawEth = useWithdrawEthAction({ onConfirm });

  const { data: rageQuitDetails, isLoading: isRageQuitDataLoading } =
    useRageQuitEscrowDetails();

  const { timeFormatted: assetsLockCountdown, timeRemaining } = useCountdown(
    rageQuitDetails?.withdrawalsUnlockTimestamp ?? 0,
  );

  const tokenActionLabel = useMemo(() => {
    if (isRageQuitDataLoading || !rageQuitDetails) {
      return 'Loading...';
    }
    if (!rageQuitDetails.isRageQuitExtensionPeriodStarted) {
      return 'In withdrawal queue';
    }
    if (timeRemaining > 0) {
      return `${assetsLockCountdown} till withdrawal`;
    } else {
      return 'Withdraw';
    }
  }, [
    assetsLockCountdown,
    isRageQuitDataLoading,
    rageQuitDetails,
    timeRemaining,
  ]);

  const handleWithdrawEth = useCallback(
    (token: 'ETH') => async () => {
      invariant(totalStETHLockedShares, 'Amount is not defined');

      await withdrawEth({
        amount: totalStETHLockedShares,
        token,
        escrowAddress: rageQuitEscrowAddress,
      });
    },
    [totalStETHLockedShares, withdrawEth, rageQuitEscrowAddress],
  );

  const handleWithdrawUnstETH = useCallback(
    (token: 'Withdrawal NFT') => async () => {
      openModal({
        onConfirm: async (selectedNftIds) => {
          invariant(selectedNftIds?.length, 'ids must be presented');
          await withdrawEth({
            token,
            selectedNftIds,
            escrowAddress: rageQuitEscrowAddress,
          });
        },
        actionLabel: 'Withdraw',
        unstETHRecords: [...claimedUnstETHRecords],
      });
    },
    [claimedUnstETHRecords, openModal, rageQuitEscrowAddress, withdrawEth],
  );

  const handleClaimNFTs = useCallback(
    () => () => {
      openModal({
        onConfirm: async (selectedNftIds) => {
          invariant(selectedNftIds?.length, 'ids must be presented');
          await claimNFTs(selectedNftIds, rageQuitEscrowAddress);
        },
        actionLabel: 'Claim',
        unstETHRecords: [...claimableUnstETHRecords],
      });
    },
    [claimNFTs, claimableUnstETHRecords, openModal, rageQuitEscrowAddress],
  );

  const isWithdrawalLocked = useMemo(() => {
    return (
      typeof rageQuitDetails?.withdrawalsUnlockTimestamp !== 'number' ||
      timeRemaining > 0
    );
  }, [rageQuitDetails?.withdrawalsUnlockTimestamp, timeRemaining]);

  if (!totalLockedShares || isRageQuitDataLoading) {
    return null;
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text>
          Tokens in RageQuit{' '}
          <Link href={getEtherscanAddressLink(chainId, rageQuitEscrowAddress)}>
            contract <ExternalLinkIcon />
          </Link>
        </Text>
      </Box>
      <RevocableTokensList>
        {totalStETHLockedShares && (
          <RevocableTokenItem
            token={Token.stETH}
            amount={totalStETHLockedShares}
            isLocked={isWithdrawalLocked}
            actionLabel={tokenActionLabel}
            onClick={handleWithdrawEth('ETH')}
          />
        )}
        {claimableUnstETHRecords.length > 0 && (
          <RevocableTokenItem
            token={Token.unstETH}
            amount={sumUpUnstETHShares(claimableUnstETHRecords)}
            amountLabel={`${claimableUnstETHRecords.length} NFT`}
            actionLabel="Claim"
            onClick={handleClaimNFTs()}
          />
        )}
        {inWithdrawalQueueUnstETHRecords.length > 0 && (
          <RevocableTokenItem
            token={Token.unstETH}
            amount={sumUpUnstETHShares(inWithdrawalQueueUnstETHRecords)}
            amountLabel={`${inWithdrawalQueueUnstETHRecords.length} NFT`}
            isLocked={isWithdrawalLocked}
            actionLabel={isWithdrawalLocked ? 'In withdrawal queue' : 'Claim'}
            onClick={handleClaimNFTs()}
          />
        )}
        {claimedUnstETHRecords.length > 0 && (
          <RevocableTokenItem
            token={Token.unstETH}
            amount={sumUpUnstETHShares(claimedUnstETHRecords)}
            amountLabel={`${claimedUnstETHRecords.length} NFT`}
            isLocked={isWithdrawalLocked}
            actionLabel="Withdraw"
            onClick={handleWithdrawUnstETH('Withdrawal NFT')}
          />
        )}
      </RevocableTokensList>
    </>
  );
};
