import { TokenBalance } from 'shared/components/token-balance';
import { RevocableTokenItemStyled, InQueueInfo, RevokeButton } from './style';
import { forwardRef } from 'react';
import { Text } from 'shared/components/text';
import { RevokeIcon, SandwatchIcon } from 'shared/components/icons';
import { Token } from 'shared/blockchain/types';
import { Box } from 'shared/components/box';
import { useQuery } from '@tanstack/react-query';
import { useReadContract } from '../../../../shared/blockchain/hooks/use-read-contract';
import { StETH } from '../../../../shared/blockchain/contracts';
import { useLidoSDK } from '../../../../providers/lido-sdk';

type Props = {
  token: Token | 'ETH' | 'unstETH';
  amount: bigint | undefined;
  amountLabel?: string;
  unlockCountdown?: string;
  isLocked?: boolean;
  actionLabel?: string;
  onClick?: () => void;
};

export const RevocableTokenItem = forwardRef<HTMLDivElement, Props>(
  (props: Props, ref) => {
    const {
      token,
      amount,
      isLocked,
      amountLabel,
      unlockCountdown,
      actionLabel,
      onClick,
    } = props;

    const { chainId } = useLidoSDK();

    const readStEthContract = useReadContract(StETH);

    const {
      data: convertedStethLockedShares,
      isLoading: isConvertStEthLockedSharesLoading,
    } = useQuery({
      queryKey: ['converted-steth-locked-shares', Number(amount), chainId],
      queryFn: async (): Promise<bigint> => {
        if (!readStEthContract) {
          throw new Error('readStEthContract must be defined');
        }

        if (!amount) {
          throw new Error('amount must be defined');
        }

        return await readStEthContract.readContract('getPooledEthByShares', [
          amount,
        ]);
      },
      enabled: !!readStEthContract && !!amount && amount > 0n,
    });

    if (!amount || isConvertStEthLockedSharesLoading) {
      return null;
    }

    return (
      <RevocableTokenItemStyled ref={ref} $disabled={isLocked}>
        <TokenBalance
          token={token}
          balance={convertedStethLockedShares}
          addOnText={amountLabel}
        />
        {!!onClick && isLocked ? (
          <InQueueInfo>
            <>
              <Text size={14} color="secondary">
                {unlockCountdown ? (
                  <>
                    <b>{unlockCountdown}</b>
                  </>
                ) : (
                  actionLabel
                )}
              </Text>
              <SandwatchIcon />
            </>
          </InQueueInfo>
        ) : (
          <RevokeButton onClick={onClick} size="sm">
            <Box display="flex" alignItems="center">
              {actionLabel}
              <RevokeIcon />
            </Box>
          </RevokeButton>
        )}
      </RevocableTokenItemStyled>
    );
  },
);
