import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { Voting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { getVoteStatus } from '../utils/get-vote-status';
import { getEventStartVote } from 'shared/votes/utils/get-event-start-vote';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { usePublicClient } from 'wagmi';
import invariant from 'tiny-invariant';
import { parseVote } from 'shared/votes/utils/parse-vote';
import { getEventExecuteVote } from 'shared/votes/utils/get-event-execute-vote';

type Args = {
  voteId: string;
};
export const useVote = ({ voteId }: Args) => {
  const { chainId } = useLidoSDK();
  const client = usePublicClient();

  const votingContract = useReadContract(Voting);
  const votingContractAddress = getContractAddress(Voting, chainId);

  const { data: voteData, isLoading } = useQuery({
    queryKey: ['vote', voteId, chainId],
    queryFn: async () => {
      invariant(client, 'Client must be defined');
      const voteIdBn = BigInt(voteId);

      const [voteTime, objectionPhaseTime, vote, canExecute] =
        await Promise.all([
          votingContract.readContract('voteTime'),
          votingContract.readContract('objectionPhaseTime'),
          votingContract.readContract('getVote', [voteIdBn]),
          votingContract.readContract('canExecute', [voteIdBn]),
        ]);

      const parsedVote = parseVote(Number(voteId), vote, canExecute);

      const [
        eventStart,
        eventExecute,
        // voteEvents,
        // canVote,
        // voterState,
        // votePowerWei,
      ] = await Promise.all([
        getEventStartVote({
          address: votingContractAddress,
          client,
          voteId: BigInt(voteId),
          block: parsedVote.snapshotBlock,
        }),
        getEventExecuteVote({
          address: votingContractAddress,
          client,
          voteId: BigInt(voteId),
          block: parsedVote.snapshotBlock,
        }),
        // getVoteEvents(voting, _voteId, snapshotBlock),
        // _walletAddress ? voting.canVote(_voteId, _walletAddress) : false,
        // _walletAddress ? voting.getVoterState(_voteId, _walletAddress) : null,
        // _walletAddress
        //   ? ldo.balanceOfAt(_walletAddress, vote.snapshotBlock)
        //   : null,
      ]);

      return {
        voteTime,
        objectionPhaseTime,
        eventStart,
        eventExecute,
        canExecute,
        vote: parsedVote,
      };
    },
  });

  if (voteData) {
    const {
      voteTime,
      objectionPhaseTime,
      eventStart,
      eventExecute,
      canExecute,
      vote: {
        open,
        executed,
        startDate,
        snapshotBlock,
        supportRequired,
        minAcceptQuorum,
        yea,
        nay,
        votingPower,
        script,
        phase,
      },
    } = voteData;

    return {
      voteTime,
      objectionPhaseTime,
      eventStart,
      eventExecute,
      canExecute,
      open,
      executed,
      startDate,
      snapshotBlock: Number(snapshotBlock),
      supportRequired,
      minAcceptQuorum,
      yea,
      nay,
      votingPower,
      script,
      phase,
      status: getVoteStatus({ open, executed, phase, canExecute, script }),
      isLoading,
    };
  }
};
