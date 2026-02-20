import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { DaoToken, Voting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { getVoteStatus } from '../utils/get-vote-status';
import {
  EventStartVote,
  getEventStartVote,
} from 'shared/votes/utils/get-event-start-vote';
import { useAccount, usePublicClient } from 'wagmi';
import invariant from 'tiny-invariant';
import { parseVote } from 'shared/votes/utils/parse-vote';
import {
  EventExecuteVote,
  getEventExecuteVote,
} from 'shared/votes/utils/get-event-execute-vote';
import { getVoteEvents } from '../utils/get-vote-events';
import {
  VoteEvent,
  VotePhase,
  VoterState,
  VoteStatus,
} from 'shared/votes/types';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';

type Args = {
  voteId: bigint;
};

export type UseVoteData = {
  voteTime: bigint;
  objectionPhaseTime: bigint;
  eventStart: EventStartVote | null;
  eventExecute: EventExecuteVote | null;
  voteEvents: VoteEvent[];
  canExecute: boolean;
  voterState: VoterState | null;
  votePowerWei: bigint | null;
  open: boolean;
  executed: boolean;
  startDate: bigint;
  snapshotBlock: number;
  supportRequired: bigint;
  minAcceptQuorum: bigint;
  yea: bigint;
  nay: bigint;
  votingPower: bigint;
  script: string;
  phase: VotePhase;
  status: VoteStatus;
  voteId: bigint;
  isQuorumReached: boolean;
};

export const useVote = ({ voteId }: Args) => {
  const { chainId } = useLidoSDK();
  const client = usePublicClient({ chainId });
  const { address: accountAddress } = useAccount();

  const votingContract = useReadContract(Voting);
  const daoTokenContract = useReadContract(DaoToken);
  const votingContractAddress = useContractAddress(Voting);

  return useQuery({
    queryKey: ['vote', String(voteId), chainId, accountAddress],
    queryFn: async () => {
      invariant(client, 'Client must be defined');

      const [voteTime, objectionPhaseTime, vote, canExecute] =
        await Promise.all([
          votingContract.readContract('voteTime'),
          votingContract.readContract('objectionPhaseTime'),
          votingContract.readContract('getVote', [voteId]),
          votingContract.readContract('canExecute', [voteId]),
        ]);

      const parsedVote = parseVote(Number(voteId), vote, canExecute);

      const snapshotBlock = parsedVote.snapshotBlock;

      const [eventStart, eventExecute, voteEvents, voterState, votePowerWei] =
        await Promise.all([
          getEventStartVote({
            address: votingContractAddress,
            client,
            voteId: voteId,
            block: parsedVote.snapshotBlock,
          }),
          getEventExecuteVote({
            address: votingContractAddress,
            client,
            voteId: voteId,
            block: parsedVote.snapshotBlock,
            chainId,
          }),
          getVoteEvents(votingContractAddress, client, voteId, snapshotBlock),
          accountAddress
            ? votingContract.readContract('getVoterState', [
                voteId,
                accountAddress,
              ])
            : null,
          accountAddress
            ? daoTokenContract.readContract('balanceOfAt', [
                accountAddress,
                snapshotBlock,
              ])
            : null,
        ]);

      return {
        voteTime,
        objectionPhaseTime,
        eventStart,
        eventExecute,
        voteEvents,
        canExecute,
        voterState,
        votePowerWei,
        vote: parsedVote,
      };
    },
    select: (data) => {
      const {
        voteTime,
        objectionPhaseTime,
        eventStart,
        eventExecute,
        voteEvents,
        canExecute,
        voterState,
        votePowerWei,
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
          state: { isQuorumReached },
        },
      } = data;

      return {
        voteTime,
        objectionPhaseTime,
        eventStart,
        eventExecute,
        voteEvents,
        canExecute,
        voterState,
        votePowerWei,
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
        voteId,
        isQuorumReached,
      };
    },
  });
};
