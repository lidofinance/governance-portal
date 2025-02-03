import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { escrowAbi } from 'abi/ts';
import { zeroAddress } from 'viem';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { useDualGovernanceContext } from 'providers/dual-governance';

type EscrowBalance = {
  unstETHIdsCount: bigint;
  stETHLockedShares: bigint;
  unstETHLockedShares: bigint;
  lastAssetsLockTimestamp: number;
};

export const useEscrowBalances = () => {
  const { address } = useAccount();
  const { chainId } = useLidoSDK();
  const { vetoSignallingAddress, rageQuitAddress } = useDualGovernanceContext();

  // const wstEth = useReadContract(WstETH);

  const readEscrowContract = useReadContractGetter(escrowAbi);

  const isEnabled = !!vetoSignallingAddress && !!rageQuitAddress && !!address;
  return useQuery({
    queryKey: [
      'escrow-balances',
      chainId,
      vetoSignallingAddress,
      rageQuitAddress,
      address,
    ],
    staleTime: Infinity,
    enabled: isEnabled,
    queryFn: async () => {
      if (!isEnabled) {
        return null;
      }

      const readVetoSignallingContract = readEscrowContract(
        vetoSignallingAddress,
      );

      const minAssetLockDuration = await readVetoSignallingContract(
        'getMinAssetsLockDuration',
      );
      const vetoSignallingBalance = await readVetoSignallingContract(
        'getVetoerDetails',
        [address],
      );

      const vetoSignallingSum =
        vetoSignallingBalance.stETHLockedShares +
        vetoSignallingBalance.unstETHLockedShares;

      let rageQuitBalance: EscrowBalance | null = null;
      let rageQuitSum = 0n;

      if (rageQuitAddress !== zeroAddress) {
        rageQuitBalance = await readEscrowContract(rageQuitAddress)(
          'getVetoerDetails',
          [address],
        );

        rageQuitSum =
          rageQuitBalance.stETHLockedShares +
          rageQuitBalance.unstETHLockedShares;
      }

      // TODO: change mock value to a real one once we get into testing with real wsteth
      const wstETHLockedShares = vetoSignallingBalance.stETHLockedShares;
      // const vetoSharesInWstEth = await wstEth.readContract('getWstETHByStETH', [
      //   vetoSignallingBalance.stETHLockedShares,
      // ]);

      const assetUnlockTimestamp =
        vetoSignallingBalance.lastAssetsLockTimestamp + minAssetLockDuration;

      return {
        vetoSignallingBalance: {
          totalLockedShares: vetoSignallingSum,
          wstETHLockedShares,
          ...vetoSignallingBalance,
        },
        rageQuitBalance: {
          totalLockedShares: rageQuitSum,
          ...rageQuitBalance,
        },
        lockedSharesInEscrow: vetoSignallingSum + rageQuitSum,
        assetUnlockTimestamp,
      };
    },
  });
};
