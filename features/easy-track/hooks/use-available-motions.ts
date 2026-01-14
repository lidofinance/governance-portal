import { MotionType, MotionTypeForms } from '../motion-types';
import { useLidoSDK } from '../../../providers/lido-sdk';
import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import {
  EvmAddressesByChain,
  parseEvmSupportedChainId,
} from 'features/easy-track/evm-addresses';
import { getIsTrustedCaller } from 'shared/blockchain/utils/get-is-trusted-caller';
import { Address } from 'viem';
import { processInBatches } from 'utils/process-in-batches';

// type NodeOperatorsList = ReturnType<typeof useNodeOperatorsList>['data'];

// const getIsNodeOperatorConnected = (
//   walletAddress: string | null | undefined,
//   nodeOperatorsList: NodeOperatorsList,
// ) => {
//   if (!walletAddress || !nodeOperatorsList) return false;
//   return nodeOperatorsList.some(
//     (o) =>
//       utils.getAddress(o.rewardAddress) === utils.getAddress(walletAddress),
//   );
// };

export const useAvailableMotions = () => {
  const { chainId } = useLidoSDK();
  const { address: walletAddress } = useAccount();
  const publicClient = usePublicClient({ chainId });

  // const { data: nodeOperators } = useNodeOperatorsList('curated');

  // const { data: sandboxNodeOperators } = useNodeOperatorsList('sandbox');

  const { data: availableMotions } = useQuery({
    queryKey: ['available-motions', chainId, walletAddress],
    queryFn: async () => {
      invariant(walletAddress, 'Wallet address must be defined');
      invariant(publicClient, 'publicClient must be defined');

      const parsedChainId = parseEvmSupportedChainId(chainId);

      const nodeOperatorIncreaseLimitAddress =
        EvmAddressesByChain[parsedChainId][
          MotionTypeForms.NodeOperatorIncreaseLimit
        ];
      const sandboxNodeOperatorIncreaseLimitAddress =
        EvmAddressesByChain[parsedChainId][
          MotionTypeForms.SandboxNodeOperatorIncreaseLimit
        ];
      const curatedSubmitRequestHashesAddress =
        EvmAddressesByChain[parsedChainId][
          MotionTypeForms.CuratedExitRequestHashesSubmit
        ];

      const excludedAddresses = [
        nodeOperatorIncreaseLimitAddress,
        sandboxNodeOperatorIncreaseLimitAddress,
        curatedSubmitRequestHashesAddress,
      ].filter(
        (address) => typeof address === 'string' && address.length > 0,
      ) as string[];

      const relevantContracts: Array<{
        motionType: MotionType;
        address: Address;
      }> = Object.entries(EvmAddressesByChain[parsedChainId]).reduce(
        (acc, [contractName, contractAddress]) => {
          if (typeof contractAddress !== 'string' || !contractAddress) {
            return acc;
          }

          const address = contractAddress;

          if (excludedAddresses.includes(address.toLowerCase())) {
            return acc;
          }

          acc.push({ motionType: contractName as MotionType, address });

          return acc;
        },
        [] as Array<{ motionType: MotionType; address: Address }>,
      );

      const results = await processInBatches(
        relevantContracts,
        10,
        async (contract) => {
          const isTrusted = await getIsTrustedCaller({
            contract,
            callerAddress: walletAddress,
            chainId: parsedChainId,
            client: publicClient,
          });

          return {
            ...contract,
            isTrusted,
          };
        },
      );

      return results
        .filter(
          (
            result,
          ): result is PromiseFulfilledResult<{
            isTrusted: boolean | undefined;
            motionType: MotionType;
            address: Address;
          }> => result.status === 'fulfilled',
        )
        .map((result) => result.value)
        .filter((motion) => motion.isTrusted);
    },
  });

  // const isNodeOperatorConnected = getIsNodeOperatorConnected(
  //   walletAddress,
  //   nodeOperators,
  // );
  // const isSandboxNodeOperatorConnected = getIsNodeOperatorConnected(
  //   walletAddress,
  //   sandboxNodeOperators,
  // );

  return { availableMotions };
};
