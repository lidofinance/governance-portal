import { AragonVoting } from 'shared/blockchain/contracts';
import { useConfig } from 'config';
import { useLidoSDK } from 'providers/lido-sdk';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { VOTE_DURATIONS } from '../vote-durations';
import { useMemo } from 'react';

export const useHistoricalVoteDurations = () => {
  const votingAddress = useContractAddress(AragonVoting);
  const { chainId } = useLidoSDK();
  const { useLocalCache } = useConfig().userConfig.savedUserConfig;

  return useMemo(() => {
    const durationsRanges = useLocalCache
      ? VOTE_DURATIONS[chainId]?.[votingAddress]
      : undefined;

    return {
      isAvailable: !!durationsRanges,
      getDurations: (voteId: number) =>
        durationsRanges?.find(
          ({ lastVoteId }) => lastVoteId !== undefined && voteId <= lastVoteId,
        ),
    };
  }, [chainId, useLocalCache, votingAddress]);
};
