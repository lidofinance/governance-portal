import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';

import { ProposalCombinedData } from 'features/dual-governance/proposals/types';
import { HISTORICAL_ADDRESSES } from 'constants/historical-addresses';
import { Address } from 'viem';
import { fetchProposals } from 'features/dual-governance/utils/fetch-proposals';
import { fetchProposal } from '../utils';
import { useLidoSDK } from 'providers/lido-sdk';
import { useConfig } from 'config';
import { isTestnet as getIsTestnet } from 'shared/blockchain/utils/is-testnet';

export type ProposalsQueryResult = {
  proposalsCount: bigint;
  proposals: ProposalCombinedData[];
};

type UseProposalsConfig = {
  id?: number;
  enabled?: boolean;
};

export const useProposals = ({
  id,
  enabled = true,
}: UseProposalsConfig = {}): UseQueryResult<
  ProposalsQueryResult | ProposalCombinedData
> => {
  const { chainId, rpcProvider } = useLidoSDK();
  const { userConfig } = useConfig();
  const isInTestMode =
    userConfig.savedUserConfig.useTestContracts && getIsTestnet(chainId);
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  const governanceAddresses = HISTORICAL_ADDRESSES[
    chainId as keyof typeof HISTORICAL_ADDRESSES
  ].governanceAddresses as Address[];

  const { data: proposalsCount } = useQuery({
    queryKey: ['proposals-count', chainId],
    queryFn: async () => {
      if (!emergencyProtectedTimelock) {
        throw new Error('Emergency Protected Timelock contract not found');
      }

      return await emergencyProtectedTimelock.readContract('getProposalsCount');
    },
    enabled,
    staleTime: 30000,
  });

  return useQuery({
    queryKey: ['get-proposals', chainId, Number(proposalsCount)],
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: 'always',
    enabled: enabled && !!emergencyProtectedTimelock && !!rpcProvider,
    queryFn: async () => {
      if (!rpcProvider || !emergencyProtectedTimelock) {
        return id !== undefined ? null : { proposalsCount: 0n, proposals: [] };
      }

      try {
        if (id !== undefined) {
          return await fetchProposal({
            id,
            publicClient: rpcProvider,
            EPTContract: emergencyProtectedTimelock,
            chainId,
            governanceAddresses,
            isInTestMode,
          });
        }

        if (proposalsCount === undefined) {
          return { proposalsCount: 0n, proposals: [] };
        }

        const proposals = await fetchProposals({
          proposalsCount,
          publicClient: rpcProvider,
          EPTContract: emergencyProtectedTimelock,
          governanceAddresses,
          chainId,
        });

        return { proposalsCount, proposals };
      } catch (error) {
        const errorSuffix = id !== undefined ? ' ' + id : 's';
        console.error(`Failed to fetch proposal${errorSuffix}:`, error);
        throw new Error(`Failed to fetch proposal${errorSuffix}`);
      }
    },
  });
};
