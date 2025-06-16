import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { usePublicClient } from 'wagmi';
import { Address } from 'viem';
import { useGetHistoricalGovernanceAddresses } from './use-get-historical-governance-addresses';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { findAbiItem } from '../../../utils/find-abi-item';
import { DualGovernance } from '../../../shared/blockchain/contracts';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';
// import { useReadContractGetter } from '../../../shared/blockchain/hooks/use-read-contract';
// import { escrowAbi } from '../../../abi/ts';

const ESCROW_CHANGED_EVENT_NAME = 'NewSignallingEscrowDeployed';

/**
 *  This hook is in a draft state ATM. Do not use.
 */
export const useGetHistoricalEscrowBalances = () => {
  const { chainId } = useLidoSDK();
  const publicClient = usePublicClient();
  const isSupportedChain = useIsSupportedChain();
  // const { address: accountAddress } = useAccount();

  // const readEscrowContract = useReadContractGetter(escrowAbi);

  const {
    addresses: governanceAddresses,
    isLoading: isGovernanceAddressesLoading,
  } = useGetHistoricalGovernanceAddresses();

  const { data, isLoading } = useQuery({
    queryKey: [
      'historical-escrow-addresses',
      chainId,
      governanceAddresses?.length,
    ],
    enabled:
      !isGovernanceAddressesLoading && !!publicClient && isSupportedChain,
    queryFn: async () => {
      if (!publicClient || !governanceAddresses?.length) {
        return {
          addresses: [],
          vetoSignallingAddress: null,
        };
      }

      const allEscrowAddresses: Address[] = [];
      // const currentVetoSignallingAddress: Address | null = null;

      for (const governanceAddress of governanceAddresses) {
        try {
          const eventAbi = findAbiItem({
            abi: DualGovernance.abi,
            name: ESCROW_CHANGED_EVENT_NAME,
            type: 'event',
          });

          const deploymentBlock =
            CONTRACT_DEPLOYMENT_BLOCKS[chainId]?.dualGovernance || 0n;

          const logs = await publicClient.getLogs({
            address: governanceAddress,
            event: eventAbi,
            fromBlock: deploymentBlock,
            toBlock: 'latest',
          });

          if (logs.length > 0) {
            const escrowAddresses = logs.map(
              (log: any) => log.args.escrow as Address,
            );

            for (const addr of escrowAddresses) {
              if (!allEscrowAddresses.includes(addr)) {
                allEscrowAddresses.push(addr);
              }
            }
          }
        } catch (eventError) {
          console.error('Error fetching logs:', eventError);
        }
      }

      // const balancePromises = allEscrowAddresses.map(async (address) => {
      //   const vetoerDetails = (await readEscrowContract(address)(
      //     'getVetoerDetails',
      //     [accountAddress as Address],
      //   )) || {
      //     unstETHIdsCount: 0n,
      //     stETHLockedShares: 0n,
      //     unstETHLockedShares: 0n,
      //   };
      //
      //   return { rageQuitEscrowAddress: address, vetoerDetails };
      // });

      // const balances = await Promise.all(balancePromises);

      return {
        addresses: allEscrowAddresses,
      };
    },
    staleTime: 300000, // 5 minutes
  });

  return {
    data: {
      addresses: data?.addresses || [],
      vetoSignallingAddress: data?.vetoSignallingAddress || null,
    },
    isLoading,
  };
};
