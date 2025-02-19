import { useQuery } from '@tanstack/react-query';
import { escrowAbi } from 'abi/ts';
import { useDualGovernanceContext } from 'providers/dual-governance';
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
  const { vetoSignallingAddress } = useDualGovernanceContext();
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
        ['0x9a9B0b60842051a2ED51407b179f35Ac37f262F3'],
      );

      const withdrawalRequests = await withdrawalQueue.readContract(
        'getWithdrawalStatus',
        [unstethIds],
      );

      return unstethIds.map((id, index) => ({
        id,
        lockedBy: withdrawalRequests[index].owner,
        shares: withdrawalRequests[index].amountOfStETH,
      }));
    },
  });
};
