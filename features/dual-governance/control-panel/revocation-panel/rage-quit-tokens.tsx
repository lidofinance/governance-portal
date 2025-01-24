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

type Props = {
  rageQuitBalance: {
    unstETHIdsCount?: bigint | undefined;
    stETHLockedShares?: bigint | undefined;
    unstETHLockedShares?: bigint | undefined;
    lastAssetsLockTimestamp?: number | undefined;
    totalLockedShares: bigint;
  };
  onConfirm: () => Promise<void>;
};

export const RageQuitTokens = ({ rageQuitBalance, onConfirm }: Props) => {
  const {
    stETHLockedShares,
    unstETHLockedShares,
    unstETHIdsCount,
    totalLockedShares,
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
    }
  }, [
    assetsLockCountdown,
    isRageQuitDataLoading,
    rageQuitDetails,
    timeRemaining,
  ]);

  const handleWithdrawEth = useCallback(
    (token: 'unstETH' | 'ETH') => async () => {
      if (token === Token.unstETH) {
        openModal({
          onConfirm: async (ids) => {
            invariant(ids?.length, 'ids must be presented');
            await withdrawEth({ token, ids });
          },
          actionLabel: 'withdraw',
        });
      } else {
        invariant(stETHLockedShares, 'Amount is not defined');

        await withdrawEth({ amount: stETHLockedShares, token });
      }
    },
    [stETHLockedShares, withdrawEth, openModal],
  );

  if (!totalLockedShares || isRageQuitDataLoading) {
    return null;
  }

  const isWithdrawalLocked =
    typeof rageQuitDetails?.withdrawalsUnlockTimestamp !== 'number' ||
    timeRemaining > 0;

  return (
    <>
      <Text>Tokens in RageQuit contract</Text>
      <RevocableTokensList>
        <RevocableTokenItem
          token={'ETH'}
          amount={stETHLockedShares}
          isLocked={isWithdrawalLocked}
          actionLabel={actionLabel}
          onClick={handleWithdrawEth('ETH')}
        />
        <RevocableTokenItem
          token={Token.unstETH}
          amount={unstETHLockedShares}
          amountLabel={`${unstETHIdsCount} NFT`}
          isLocked={isWithdrawalLocked}
          actionLabel={actionLabel}
          onClick={handleWithdrawEth(Token.unstETH)}
        />
      </RevocableTokensList>
    </>
  );
};
