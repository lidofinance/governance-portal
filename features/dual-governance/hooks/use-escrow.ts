import { useQuery } from '@tanstack/react-query';
import { zeroAddress } from 'viem';
import { escrowAbi } from 'abi/ts/Escrow';
import { useLidoSDK } from 'providers/lido-sdk';
import { DualGovernance } from 'shared/blockchain/contracts';
import { getContractInstance } from 'shared/blockchain/get-contract-instance';
import { useContractInstance } from 'shared/blockchain/hooks/use-contract-instance';
import { ContractInstance } from 'shared/blockchain/types';

export const useEscrow = () => {
  const { chainId, core } = useLidoSDK();
  const dualGovernance = useContractInstance(DualGovernance);

  const { data, isLoading } = useQuery({
    queryKey: ['escrow-contract', chainId],
    staleTime: Infinity,
    queryFn: async () => {
      const vetoSignalingAddress =
        await dualGovernance.read.getVetoSignallingEscrow();

      const vetoSignallingEscrow = getContractInstance(
        vetoSignalingAddress,
        escrowAbi,
        core,
      );

      const rageQuitAddress = await dualGovernance.read.getRageQuitEscrow();

      let rageQuitEscrow: ContractInstance<typeof escrowAbi> | null = null;

      if (rageQuitAddress !== zeroAddress) {
        rageQuitEscrow = getContractInstance(rageQuitAddress, escrowAbi, core);
      }

      return {
        vetoSignallingEscrow,
        rageQuitEscrow,
      };
    },
  });

  return {
    vetoSignallingEscrow: data?.vetoSignallingEscrow,
    rageQuitEscrow: data?.rageQuitEscrow,
    isLoading,
  };
};
