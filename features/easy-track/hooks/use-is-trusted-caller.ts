import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { ContractObject } from 'shared/blockchain/types';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';

type TrustedCallerAbi = readonly [
  {
    readonly type: 'function';
    readonly inputs: readonly [];
    readonly name: 'trustedCaller';
    readonly outputs: readonly [
      {
        readonly name: '';
        readonly internalType: 'address';
        readonly type: 'address';
      },
    ];
    readonly stateMutability: 'view';
  },
];

export const useIsTrustedCaller = (contractObject: ContractObject) => {
  const { chainId } = useLidoSDK();
  const { address } = useAccount();

  const contractInstance = useReadContract<TrustedCallerAbi>(
    contractObject as ContractObject<TrustedCallerAbi>,
  );

  const result = useQuery({
    queryKey: ['is-trusted-caller', contractInstance.address, address, chainId],
    queryFn: async () => {
      const trustedCaller =
        await contractInstance.readContract('trustedCaller');
      if (trustedCaller === null) {
        return false;
      }

      return trustedCaller.toLowerCase() === address?.toLowerCase();
    },
    enabled: !!address,
  });

  return {
    isTrustedCallerConnected: result.data,
    isTrustedCallerLoading: result.isLoading,
  };
};
