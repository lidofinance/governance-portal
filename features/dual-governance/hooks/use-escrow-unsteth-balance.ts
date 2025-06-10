import { useQuery } from '@tanstack/react-query';
import { escrowAbi } from 'abi/ts';
import { useEscrowContext } from 'providers/escrow';
import { useLidoSDK } from 'providers/lido-sdk';
import { WithdrawalQueue } from 'shared/blockchain/contracts';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { useAccount } from 'wagmi';

// type UnstEth = {
//   amountOfStETH: bigint;
//   amountOfShares: bigint;
//   owner: `0x${string}`;
//   timestamp: bigint;
//   isFinalized: boolean;
//   isClaimed: boolean;
// };

// const getUnstEthStatus = (unstEth: UnstEth) => {
//   if (unstEth.isFinalized) {
//     return 'Finalized';
//   }
//   if (unstEth.isClaimed) {
//     return 'Claimed';
//   }
//   return 'Not finalized';
// };

export const useEscrowUnstethBalance = () => {
  const { address } = useAccount();
  const { chainId } = useLidoSDK();
  const { vetoSignallingAddress } = useEscrowContext();
  const readEscrowContract = useReadContractGetter(escrowAbi);
  const withdrawalQueue = useReadContract(WithdrawalQueue);

  const isEnabled = !!vetoSignallingAddress && !!address;

  return useQuery({
    queryKey: ['locked-unsteth-data', chainId, address],
    enabled: isEnabled,
    queryFn: async () => {
      if (!isEnabled) return;

      const unstethIds = await readEscrowContract(vetoSignallingAddress)(
        'getVetoerUnstETHIds',
        [address],
      );

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
