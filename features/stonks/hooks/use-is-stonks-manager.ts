import { useQuery } from '@tanstack/react-query';
import { stonksV2Abi } from 'abi/generated';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

export const useIsStonksManager = (stonksOrOrderAddress: Address) => {
  const { address: walletAddress } = useAccount();
  const { chainId } = useLidoSDK();

  const getStonksContract = useReadContractGetter(stonksV2Abi);

  return useQuery({
    queryKey: [
      'stonks-is-manager',
      chainId,
      walletAddress,
      stonksOrOrderAddress,
    ],
    enabled: !!walletAddress,
    queryFn: async () => {
      const stonksContractReader = getStonksContract(stonksOrOrderAddress);

      const stonksManager = await stonksContractReader('manager');

      return stonksManager.toLowerCase() === walletAddress?.toLowerCase();
    },
  });
};
