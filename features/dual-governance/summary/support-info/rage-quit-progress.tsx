import { useQuery } from '@tanstack/react-query';
import { escrowAbi } from 'abi/ts';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { ProgressBar } from 'shared/components/progress-bar';
import { Text } from 'shared/components/text';
import { zeroAddress } from 'viem';
import {
  Divider,
  RageQuitProgressWrapper,
  RageQuitWithdrawals,
} from './styles';
import { formatEth } from 'shared/blockchain/utils';

export const RageQuitProgress = () => {
  const { chainId } = useLidoSDK();
  const { vetoSignallingAddress } = useDualGovernanceContext();
  const readEscrowContract = useReadContractGetter(escrowAbi);

  const isEnabled =
    !!vetoSignallingAddress && vetoSignallingAddress !== zeroAddress;

  const { data: rageQuitData, isLoading } = useQuery({
    queryKey: ['rage-quit-escrow-data', chainId],
    staleTime: 300000, // 5 minutes
    enabled: isEnabled,
    queryFn: async () => {
      if (!isEnabled) return;

      const lockedAssets = await readEscrowContract(vetoSignallingAddress)(
        'getLockedAssetsTotals',
      );

      const {
        stETHClaimedETH,
        stETHLockedShares,
        unstETHFinalizedETH,
        unstETHUnfinalizedShares,
      } = lockedAssets;

      const claimedAmount = stETHClaimedETH + unstETHFinalizedETH;
      const totalAmount = stETHLockedShares + unstETHUnfinalizedShares;

      if (totalAmount === 0n) {
        return {
          progress: 0,
          claimedAmount,
          totalAmount,
        };
      }

      return {
        progress: Number(claimedAmount / totalAmount) * 100,
        claimedAmount,
        totalAmount,
      };
    },
  });

  if (isLoading) {
    return null;
  }

  // TODO: add a proper error handling
  if (!rageQuitData) {
    return null;
  }

  return (
    <RageQuitProgressWrapper>
      <Text color="secondary" size={22} weight={300}>
        RageQuit
      </Text>
      <RageQuitWithdrawals>
        <Text as="span" size={22} weight={600}>
          {formatEth(rageQuitData.claimedAmount)}
        </Text>
        <Divider />
        <Text as="span" weight={600}>
          {formatEth(rageQuitData.totalAmount)}
        </Text>
        <Text as="span" color="secondary">
          stETH is withdrawn
        </Text>
      </RageQuitWithdrawals>
      <ProgressBar
        progressTitle="finalised"
        progressPercent={rageQuitData.progress}
        totalPercent={100}
      />
    </RageQuitProgressWrapper>
  );
};
