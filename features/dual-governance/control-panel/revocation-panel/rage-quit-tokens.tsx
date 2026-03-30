import { Text } from 'shared/components/text';
import { RevocableTokensList } from './style';
import { RevocableTokenItem } from './revocable-token-item';
import { Token } from 'shared/blockchain/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import invariant from 'tiny-invariant';
import { useWithdrawEthAction } from '@dg/write-actions/withdraw-eth';
import { useRageQuitEscrowDetails } from '@dg/hooks/use-rage-quit-escrow-details';
import { useCountdown } from 'shared/hooks/use-countdown';
import { useSelectUnstethModal } from '@dg/modals/modal-manager';
import { Box } from 'shared/components/box';
import { Address } from 'viem';
import { Link } from '@lidofinance/lido-ui';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { useLidoSDK } from 'providers/lido-sdk';
import { ExternalLinkIcon } from 'shared/components/icons';
import { UnstETHRecordStatus } from '@dg/types';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import {
  EscrowBalance,
  RageQuitEscrowUnstETHRecord,
} from '@dg/hooks/use-escrow-balances';

type Props = {
  onConfirm: () => Promise<void>;
  escrowBalance: EscrowBalance;
  claimNFTs: (
    selectedNftIds: string[],
    escrowAddress: Address,
  ) => Promise<boolean | undefined>;
  withdrawalQueueContract: any;
};

const sumUpUnstETHShares = (records: RageQuitEscrowUnstETHRecord[]) =>
  records.reduce((sum, record) => sum + record.shares, 0n);

export const RageQuitTokens = ({
  escrowBalance,
  onConfirm,
  claimNFTs,
  withdrawalQueueContract,
}: Props) => {
  const isSupportedChain = useIsSupportedChain();
  const { chainId } = useLidoSDK();

  const {
    stETHLockedShares,
    totalLockedShares,
    escrowAddress,
    activeUnstethRecords,
  } = escrowBalance;

  const [resolvedRecords, setResolvedRecords] = useState<
    RageQuitEscrowUnstETHRecord[]
  >([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refreshNftStatus = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (activeUnstethRecords.length === 0) {
      setResolvedRecords([]);
      return;
    }
    let cancelled = false;
    const fetchRecords = async () => {
      const records = await Promise.all(
        activeUnstethRecords.map(async (record) => {
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
  }, [activeUnstethRecords, withdrawalQueueContract, refreshTrigger]);

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
      invariant(stETHLockedShares, 'Amount is not defined');

      await withdrawEth({
        amount: stETHLockedShares,
        token,
        escrowAddress: escrowAddress,
      });
    },
    [stETHLockedShares, withdrawEth, escrowAddress],
  );

  const handleWithdrawUnstETH = useCallback(
    (token: 'Withdrawal NFT') => async () => {
      openModal({
        onConfirm: async (selectedNftIds) => {
          invariant(selectedNftIds?.length, 'ids must be presented');
          await withdrawEth({
            token,
            selectedNftIds,
            escrowAddress: escrowAddress,
          });
        },
        actionLabel: 'Withdraw',
        unstETHRecords: [...claimedUnstETHRecords],
      });
    },
    [claimedUnstETHRecords, openModal, escrowAddress, withdrawEth],
  );

  const handleClaimNFTs = useCallback(
    () => () => {
      openModal({
        onConfirm: async (selectedNftIds) => {
          invariant(selectedNftIds?.length, 'ids must be presented');
          const success = await claimNFTs(selectedNftIds, escrowAddress);
          if (success) {
            refreshNftStatus();
          }
        },
        actionLabel: 'Claim',
        unstETHRecords: [...claimableUnstETHRecords],
      });
    },
    [
      claimNFTs,
      claimableUnstETHRecords,
      openModal,
      escrowAddress,
      refreshNftStatus,
    ],
  );

  const isWithdrawalLocked = useMemo(() => {
    return (
      typeof rageQuitDetails?.withdrawalsUnlockTimestamp !== 'number' ||
      timeRemaining > 0 ||
      !isSupportedChain
    );
  }, [
    isSupportedChain,
    rageQuitDetails?.withdrawalsUnlockTimestamp,
    timeRemaining,
  ]);

  if (
    !totalLockedShares ||
    isRageQuitDataLoading ||
    !stETHLockedShares ||
    (activeUnstethRecords.length === 0 && stETHLockedShares === 0n)
  ) {
    return null;
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text>
          Tokens in RageQuit{' '}
          <Link href={getEtherscanAddressLink(chainId, escrowAddress)}>
            contract <ExternalLinkIcon />
          </Link>
        </Text>
      </Box>
      <RevocableTokensList>
        {stETHLockedShares && (
          <RevocableTokenItem
            token={
              rageQuitDetails?.isRageQuitExtensionPeriodStarted
                ? 'ETH'
                : Token.stETH
            }
            amount={stETHLockedShares}
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
            token={'ETH'} // NFT becomes ETH after claiming
            amount={sumUpUnstETHShares(claimedUnstETHRecords)}
            amountLabel={`${claimedUnstETHRecords.length} NFT`}
            isLocked={isWithdrawalLocked}
            actionLabel={
              timeRemaining > 0
                ? `${assetsLockCountdown} till withdrawal`
                : isWithdrawalLocked
                  ? 'In withdrawal queue'
                  : 'Withdraw'
            }
            onClick={handleWithdrawUnstETH('Withdrawal NFT')}
          />
        )}
      </RevocableTokensList>
    </>
  );
};
