import { Text } from 'shared/components/text';
import { RevocableTokensList } from './style';
import { RevocableTokenItem } from './revocable-token-item';
import { Token } from 'shared/blockchain/types';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWithdrawEthAction } from 'features/dual-governance/write-actions/withdraw-eth';

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
  const { stETHLockedShares, unstETHLockedShares, unstETHIdsCount } =
    rageQuitBalance;

  const withdrawEth = useWithdrawEthAction({ onConfirm });

  const handleWithdrawEth = useCallback(
    (token: Token) => async (selectedNftIds?: string[]) => {
      if (token === Token.unstETH) {
        invariant(selectedNftIds?.length, 'ids must be presented');

        await withdrawEth({ token, ids: selectedNftIds });
      } else {
        invariant(stETHLockedShares, 'Amount is not defined');

        await withdrawEth({ amount: stETHLockedShares, token });
      }
    },
    [stETHLockedShares, withdrawEth],
  );

  return (
    <>
      <Text>Tokens in RageQuit contract</Text>
      <RevocableTokensList>
        <RevocableTokenItem
          token={Token.stETH}
          amount={stETHLockedShares}
          mode="withdraw"
          onClick={handleWithdrawEth(Token.stETH)}
        />
        <RevocableTokenItem
          token={Token.unstETH}
          amount={unstETHLockedShares}
          addOnText={`${unstETHIdsCount} NFT`}
          mode="withdraw"
          onClick={handleWithdrawEth(Token.unstETH)}
        />
      </RevocableTokensList>
    </>
  );
};
