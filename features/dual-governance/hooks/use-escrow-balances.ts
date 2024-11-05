import { useQuery } from '@tanstack/react-query';
import { useEscrow } from './use-escrow';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';

type EscrowBalance = {
  stETHLockedShares: bigint;
  unstETHLockedShares: bigint;
  unstETHIdsCount: bigint;
  lastAssetsLockTimestamp: bigint;
};

const MOCK = {
  stETHLockedShares: BigInt(10040012340000000000000),
  unstETHLockedShares: BigInt(200),
  unstETHIdsCount: BigInt(5),
  lastAssetsLockTimestamp: BigInt(100500),
};

export const useEscrowBalances = () => {
  const { vetoSignallingEscrow, rageQuitEscrow, isLoading } = useEscrow();
  const account = useAccount();
  const { chainId } = useLidoSDK();

  const result = useQuery({
    queryKey: ['escrow-balances', chainId],
    staleTime: Infinity,
    enabled: !!vetoSignallingEscrow && !!account.address,
    queryFn: async () => {
      if (!vetoSignallingEscrow || !account.address) return null;

      const vetoSignalingBalance =
        await vetoSignallingEscrow.read.getVetoerState([account.address]);

      console.log('balances', vetoSignalingBalance);

      const vetoSignalingSum =
        vetoSignalingBalance.stETHLockedShares +
        vetoSignalingBalance.unstETHLockedShares;

      let rageQuitBalance: EscrowBalance | null = null;
      let rageQuitSum = 0n;

      if (rageQuitEscrow) {
        rageQuitBalance = await rageQuitEscrow.read.getVetoerState([
          account.address,
        ]);

        console.log('rageQuitBalances', rageQuitBalance);

        rageQuitSum =
          rageQuitBalance.stETHLockedShares +
          rageQuitBalance.unstETHLockedShares;
      }

      return {
        vetoSignalBalance: MOCK,
        rageQuitBalance: MOCK,
        vetoSignalingSum: MOCK.stETHLockedShares + MOCK.unstETHLockedShares,
        rageQuitSum: MOCK.stETHLockedShares + MOCK.unstETHLockedShares,
        totalSum: MOCK.stETHLockedShares + MOCK.unstETHLockedShares,
        // totalSum: vetoSignalingSum + rageQuitSum,
      };
    },
  });

  return {
    data: result.data,
    isLoading: isLoading || result.isLoading,
  };
};
