import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useConfig } from 'config';
import { useLidoSDK } from 'providers/lido-sdk';
import { AragonVoting, VoteLabels } from 'shared/blockchain/contracts';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';

export const VoteLabel = {
  None: 0,
  Verified: 1,
  Flagged: 2,
} as const;

export type VoteLabel = (typeof VoteLabel)[keyof typeof VoteLabel];

// TODO: remove once VoteLabels is deployed on Mainnet
const LAST_APPROVED_VOTE_ID: Record<string, number> = {
  [getContractAddress(AragonVoting, CHAINS.Mainnet)]: 207,
};

const LABELS_CHUNK_SIZE = 1000;

export const useVoteLabels = () => {
  const { chainId } = useLidoSDK();
  const voting = useReadContract(AragonVoting);
  const getVoteLabelsReader = useReadContractGetter(VoteLabels.abi);
  const { useTestContracts } = useConfig().userConfig.savedUserConfig;
  const labelsAddress =
    VoteLabels.chainAddressMap[chainId] &&
    getContractAddress(VoteLabels, chainId, useTestContracts);

  return useQuery({
    queryKey: ['vote-labels', chainId, voting.address],
    queryFn: async (): Promise<VoteLabel[]> => {
      if (!labelsAddress) {
        const lastApprovedVoteId = LAST_APPROVED_VOTE_ID[voting.address] ?? -1;
        return Array.from(
          { length: lastApprovedVoteId + 1 },
          () => VoteLabel.Verified,
        );
      }

      // TODO: use useReadContract once mainnet is live
      const readVoteLabels = getVoteLabelsReader(labelsAddress);
      const rawVotesLength = await voting.readContract('votesLength');
      if (rawVotesLength === null) {
        throw new Error('Failed to read votesLength');
      }
      const votesLength = Number(rawVotesLength);
      const voteIds = Array.from({ length: votesLength }, (_, id) =>
        BigInt(id),
      );

      const labels: VoteLabel[] = [];
      for (let start = 0; start < votesLength; start += LABELS_CHUNK_SIZE) {
        const chunkIds = voteIds.slice(start, start + LABELS_CHUNK_SIZE);
        const chunk = await readVoteLabels('getVoteLabels', [chunkIds]);
        if (chunk === null) {
          throw new Error('Failed to read vote labels');
        }
        labels.push(...(chunk as VoteLabel[]));
      }
      return labels;
    },
    staleTime: 90 * 1000,
  });
};

export const useVoteLabel = (voteId: number) => {
  const { data: labels } = useVoteLabels();

  return labels && (labels[voteId] ?? VoteLabel.None);
};

export const useFlaggedVoteIds = () => {
  const { data: labels } = useVoteLabels();

  return useMemo(
    () =>
      labels?.flatMap((label, voteId) =>
        label === VoteLabel.Flagged ? [voteId] : [],
      ),
    [labels],
  );
};
