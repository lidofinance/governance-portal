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
import { UnstETHRecordStatus } from '../../types';
import { Link } from '@lidofinance/lido-ui';
import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import { useLidoSDK } from 'providers/lido-sdk';
import { ExternalLinkIcon } from 'shared/components/icons';

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
};

export const RageQuitTokens = ({ rageQuitBalance, onConfirm }: Props) => {
  const { chainId } = useLidoSDK();

  const {
    totalStETHLockedShares,
    totalLockedShares,
    unstETHRecords,
    rageQuitEscrowAddress,
  } = rageQuitBalance;

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

  const sumUpUnstETHRecordShares = useCallback(
    (records: RageQuitEscrowUnstETHRecord[]) => {
      return records.reduce((sum, record) => sum + record.shares, 0n);
    },
    [],
  );

  const handleWithdrawEth = useCallback(
    (token: 'Withdrawal NFT' | 'ETH') => async () => {
      if (token === Token.unstETH) {
        openModal({
          onConfirm: async (selectedNftIds) => {
            invariant(selectedNftIds?.length, 'ids must be presented');
            await withdrawEth({ token, selectedNftIds });
          },
          actionLabel: 'withdraw',
        });
      } else {
        invariant(totalStETHLockedShares, 'Amount is not defined');

        await withdrawEth({ amount: totalStETHLockedShares, token });
      }
    },
    [totalStETHLockedShares, withdrawEth, openModal],
  );

  if (!totalLockedShares || isRageQuitDataLoading) {
    return null;
  }

  const isWithdrawalLocked =
    typeof rageQuitDetails?.withdrawalsUnlockTimestamp !== 'number' ||
    timeRemaining > 0;

  const finalizedUnstETHRecords = unstETHRecords.filter(
    (record) => record.status === UnstETHRecordStatus.Finalized,
  );

  const claimedUnstETHRecords = unstETHRecords.filter(
    (record) => record.status === UnstETHRecordStatus.Claimed,
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text>
          Tokens in RageQuit{' '}
          <Link href={getEtherscanAddressLink(chainId, rageQuitEscrowAddress)}>
            contract <ExternalLinkIcon /> {rageQuitEscrowAddress}
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
        {finalizedUnstETHRecords.length > 0 && (
          <RevocableTokenItem
            token={Token.unstETH}
            amount={sumUpUnstETHRecordShares(finalizedUnstETHRecords)}
            amountLabel={`${finalizedUnstETHRecords.length} NFT`}
            isLocked={isWithdrawalLocked}
            actionLabel="Claim"
            onClick={handleWithdrawEth(Token.unstETH)}
          />
        )}
        {claimedUnstETHRecords.length > 0 && (
          <RevocableTokenItem
            token={Token.unstETH}
            amount={sumUpUnstETHRecordShares(claimedUnstETHRecords)}
            amountLabel={`${claimedUnstETHRecords.length} NFT`}
            isLocked={isWithdrawalLocked}
            actionLabel={actionLabel}
            onClick={handleWithdrawEth(Token.unstETH)}
          />
        )}
      </RevocableTokensList>
    </>
  );
};
