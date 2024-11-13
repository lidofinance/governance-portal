import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { escrowAbi } from 'abi/ts';
import { zeroAddress } from 'viem';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { useEscrowAddresses } from './use-escrow-addresses';

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
  const { address } = useAccount();
  const { chainId } = useLidoSDK();

  const { vetoSignallingAddress, rageQuitAddress, isLoading } =
    useEscrowAddresses();

  const readEscrowContract = useReadContractGetter({
    abi: escrowAbi,
  });

  const isEnabled = !!vetoSignallingAddress && !!rageQuitAddress && !!address;

  const result = useQuery({
    queryKey: ['escrow-balances', chainId],
    staleTime: Infinity,
    enabled: isEnabled,
    queryFn: async () => {
      if (!isEnabled) {
        return null;
      }

      const vetoSignalingBalance = await readEscrowContract(
        vetoSignallingAddress,
      )('getVetoerState', [address]);

      const vetoSignalingSum =
        vetoSignalingBalance.stETHLockedShares +
        vetoSignalingBalance.unstETHLockedShares;

      let rageQuitBalance: EscrowBalance | null = null;
      let rageQuitSum = 0n;

      if (rageQuitAddress !== zeroAddress) {
        rageQuitBalance = await readEscrowContract(rageQuitAddress)(
          'getVetoerState',
          [address],
        );

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
