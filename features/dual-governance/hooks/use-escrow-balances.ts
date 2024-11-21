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

export const useEscrowBalances = () => {
  const { address } = useAccount();
  const { chainId } = useLidoSDK();

  const { vetoSignallingAddress, rageQuitAddress, isLoading } =
    useEscrowAddresses();

  const readEscrowContract = useReadContractGetter(escrowAbi);

  const isEnabled = !!vetoSignallingAddress && !!rageQuitAddress && !!address;

  const result = useQuery({
    queryKey: ['escrow-balances', chainId],
    staleTime: Infinity,
    enabled: isEnabled,
    queryFn: async () => {
      if (!isEnabled) {
        return null;
      }

      const vetoSignallingBalance = await readEscrowContract(
        vetoSignallingAddress,
      )('getVetoerState', [address]);

      const vetoSignallingSum =
        vetoSignallingBalance.stETHLockedShares +
        vetoSignallingBalance.unstETHLockedShares;

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
        vetoSignallingBalance,
        rageQuitBalance,
        vetoSignallingSum,
        rageQuitSum,
        totalSum: vetoSignallingSum + rageQuitSum,
      };
    },
  });

  return {
    data: result.data,
    isLoading: isLoading || result.isLoading,
  };
};
