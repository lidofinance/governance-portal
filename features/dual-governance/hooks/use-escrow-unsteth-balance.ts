import { useQuery } from '@tanstack/react-query';
import { dgEscrowAbi } from 'abi/generated';
import { useLidoSDK } from 'providers/lido-sdk';
import { WithdrawalQueue } from 'shared/blockchain/contracts';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { useAccount } from 'wagmi';
import { Address } from 'viem';

export const useEscrowUnstethBalance = (escrowAddress: Address) => {
  const { address } = useAccount();
  const { chainId } = useLidoSDK();
  const readEscrowContract = useReadContractGetter(dgEscrowAbi);
  const withdrawalQueue = useReadContract(WithdrawalQueue);

  const isEnabled = !!escrowAddress && !!address;

  return useQuery({
    queryKey: [
      'locked-unsteth-data',
      chainId,
      escrowAddress,
      address?.toString(),
    ],
    enabled: isEnabled,
    queryFn: async () => {
      if (!isEnabled) return;

      const unstethIds = await readEscrowContract(escrowAddress)(
        'getVetoerUnstETHIds',
        [address],
      );

      if (!unstethIds || unstethIds.length === 0) {
        return [];
      }

      const withdrawalRequests = await withdrawalQueue.readContract(
        'getWithdrawalStatus',
        [unstethIds],
      );

      return unstethIds.map((id: bigint, index: number) => ({
        id,
        lockedBy: withdrawalRequests[index].owner,
        shares: withdrawalRequests[index].amountOfStETH,
      }));
    },
  });
};
