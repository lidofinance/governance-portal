import { Text } from 'shared/components/text';
import { RevocableTokensList } from './style';
import { RevocableTokenItem } from './revocable-token-item';
import { Token } from 'shared/blockchain/types';
import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { useWithdrawEthAction } from 'features/dual-governance/write-actions/withdraw-eth';
import { useRageQuitEscrowDetails } from 'features/dual-governance/hooks/use-rage-quit-escrow-details';
import { useCountdown } from 'shared/hooks/use-countdown';
import { useSelectUnstethModal } from 'features/dual-governance/modals/modal-manager';
import { Box } from 'shared/components/box';
import { Address } from 'viem';
import { RageQuitEscrowUnstETHRecord } from '../../utils';
import { Link } from '@lidofinance/lido-ui';
import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import { useLidoSDK } from 'providers/lido-sdk';
import { ExternalLinkIcon } from 'shared/components/icons';
import { UnstETHRecordStatus } from '../../types';
import { CHAINS } from '@lido-sdk/constants';

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
};

const sumUpUnstETHShares = (records: RageQuitEscrowUnstETHRecord[]) =>
  records.reduce((sum, record) => sum + record.shares, 0n);

export const RageQuitTokens = ({
  rageQuitBalance,
  onConfirm,
  claimNFTs,
}: Props) => {
  const { chainId } = useLidoSDK();

  const {
    totalStETHLockedShares,
    totalLockedShares,
    unstETHRecords,
    rageQuitEscrowAddress,
  } = rageQuitBalance;

  const claimableUnstETHRecords = unstETHRecords.filter(
    (record) => record.status === UnstETHRecordStatus.Locked,
  );

  const claimedUnstETHRecords = unstETHRecords.filter(
    (record) => record.status === UnstETHRecordStatus.Claimed,
  );

  const { openModal } = useSelectUnstethModal();

  const withdrawEth = useWithdrawEthAction({ onConfirm });

  const { data: rageQuitDetails, isLoading: isRageQuitDataLoading } =
    useRageQuitEscrowDetails();

  const { timeFormatted: assetsLockCountdown, timeRemaining } = useCountdown(
    rageQuitDetails?.withdrawalsUnlockTimestamp ?? 0,
  );

  const actionLabel = useMemo(() => {
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

  if (!totalLockedShares || isRageQuitDataLoading) {
    return null;
  }

  const isWithdrawalLocked =
    typeof rageQuitDetails?.withdrawalsUnlockTimestamp !== 'number' ||
    timeRemaining > 0;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text>
          Tokens in RageQuit{' '}
          <Link
            href={getEtherscanAddressLink(
              chainId as unknown as CHAINS, // chains mismatch between @lido-sdk & lido-ethereum-sdk
              rageQuitEscrowAddress,
            )}
          >
            contract <ExternalLinkIcon />
          </Link>
        </Text>
      </Box>
      <RevocableTokensList>
        <RevocableTokenItem
          token={'ETH'}
          amount={totalStETHLockedShares}
          isLocked={isWithdrawalLocked}
          actionLabel={actionLabel}
          onClick={handleWithdrawEth('ETH')}
        />
        {claimableUnstETHRecords.length > 0 && (
          <RevocableTokenItem
            token={Token.unstETH}
            amount={sumUpUnstETHShares(claimableUnstETHRecords)}
            amountLabel={`${claimableUnstETHRecords.length} NFT`}
            isLocked={isWithdrawalLocked}
            actionLabel="Claim"
            onClick={handleClaimNFTs()}
          />
        )}

        {claimedUnstETHRecords.length > 0 && (
          <RevocableTokenItem
            token={'unstETH'}
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
