import { useQuery } from '@tanstack/react-query';
import { Hash, parseEventLogs } from 'viem';
import { useConfig } from 'config';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { AragonVoting, DualGovernance } from 'shared/blockchain/contracts';
import { fetchAragonVotes } from 'shared/votes/utils/fetch-aragon-votes';
import { getFlaggedVoteIds } from 'shared/votes/utils/is-vote-flagged';
import { findAbiItem } from 'utils/find-abi-item';
import { fetchLogsInParallelChunks } from 'utils/fetch-logs-in-parallel';
import { useProposalsCount } from './use-proposals';

const executeVoteEventAbi = findAbiItem({
  abi: AragonVoting.abi,
  name: 'ExecuteVote',
  type: 'event',
});

// IDs of the DG proposals submitted in the execute tx of a flagged vote.
// Keyed on the proposals count to pick up a flagged vote enacted later.
export const useFlaggedProposalIds = ({ enabled = true } = {}) => {
  const { chainId, rpcProvider } = useLidoSDK();
  const votingContract = useReadContract(AragonVoting);
  const { useLocalCache } = useConfig().userConfig.savedUserConfig;
  const voteIds = getFlaggedVoteIds(chainId);
  const { data: proposalsCount } = useProposalsCount({ enabled });

  return useQuery({
    queryKey: [
      'flagged-proposal-ids',
      chainId,
      voteIds,
      useLocalCache,
      Number(proposalsCount),
    ],
    enabled: enabled && proposalsCount !== undefined,
    staleTime: Infinity,
    queryFn: async () => {
      if (voteIds.length === 0) {
        return [];
      }
      const [votesLength, voteTime] = await Promise.all([
        votingContract.readContract('votesLength'),
        votingContract.readContract('voteTime'),
      ]);

      if (votesLength === null) {
        throw new Error('Failed to read votesLength');
      }

      const votes = await fetchAragonVotes({
        votingContract,
        chainId,
        client: rpcProvider,
        onlyActive: false,
        // getVote reverts on a nonexistent ID, which would empty the DG list
        voteIds: voteIds.filter((id) => id < Number(votesLength)),
        voteTime: Number(voteTime),
        useLocalCache,
      });

      const proposalIds = await Promise.all(
        votes.map(async (vote) => {
          if (!vote.executed) {
            return [];
          }
          let hash = vote.executeEvent?.event.transactionHash;
          // Missed by the 1-week window or a swallowed RPC error. Uncached
          // votes are recent, so a newest-first search ends in the first chunks
          if (!hash) {
            const [log] = await fetchLogsInParallelChunks<{
              transactionHash: Hash;
            }>({
              client: rpcProvider,
              address: votingContract.address,
              event: executeVoteEventAbi,
              args: { voteId: BigInt(vote.id) },
              fromBlock: vote.snapshotBlock,
              toBlock: await rpcProvider.getBlockNumber(),
              returnOnFirstMatch: true,
            });
            if (!log) {
              throw new Error(`ExecuteVote not found for vote ${vote.id}`);
            }
            hash = log.transactionHash;
          }
          const receipt = await rpcProvider.getTransactionReceipt({ hash });
          return parseEventLogs({
            abi: DualGovernance.abi,
            eventName: 'ProposalSubmitted',
            logs: receipt.logs,
          }).map((log) => Number(log.args.proposalId));
        }),
      );

      return proposalIds.flat();
    },
  });
};
