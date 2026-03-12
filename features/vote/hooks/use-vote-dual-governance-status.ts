import { usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import invariant from 'tiny-invariant';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import {
  DualGovernance,
  EmergencyProtectedTimelock,
} from 'shared/blockchain/contracts';
import { Address, Log, parseEventLogs } from 'viem';
import { EventExecuteVote } from 'shared/votes/types';

type Args = {
  voteId: number | string | undefined;
  eventExecuteVote: EventExecuteVote | null | undefined;
};

type DualGovernanceProposalSubmittedLog = Log & {
  args: {
    metadata: string;
    proposalId: bigint;
    proposerAccount: Address;
  };
};

export const useVoteDualGovernanceStatus = ({
  voteId,
  eventExecuteVote,
}: Args) => {
  const client = usePublicClient();
  const { chainId } = useLidoSDK();

  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  const isEnabled = !!client && !!eventExecuteVote && !!voteId;

  const query = useQuery({
    queryKey: [
      `dg-status`,
      voteId,
      chainId,
      eventExecuteVote?.event.transactionHash,
    ],
    enabled: isEnabled,
    queryFn: async () => {
      invariant(client, 'Client must be defined');
      invariant(eventExecuteVote, 'Execute event must be provided');

      if (!eventExecuteVote.event.transactionHash) {
        return null;
      }

      try {
        const receipt = await client.getTransactionReceipt({
          hash: eventExecuteVote.event.transactionHash,
        });

        const logs = parseEventLogs({
          abi: DualGovernance.abi,
          logs: receipt.logs,
        });

        const proposalSubmittedLog = logs.find(
          (log) => log.eventName === 'ProposalSubmitted',
        ) as DualGovernanceProposalSubmittedLog;

        if (!proposalSubmittedLog) {
          return null;
        }

        const proposalId = proposalSubmittedLog.args.proposalId;

        const proposalInfo = await emergencyProtectedTimelock.readContract(
          'getProposal',
          [proposalId],
        );

        if (proposalInfo === null) {
          return null;
        }

        return {
          proposalId: Number(proposalId),
          proposalStatus: proposalInfo[0].status,
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    },
  });

  return {
    ...query,
    isLoading:
      eventExecuteVote === undefined
        ? true
        : isEnabled
          ? query.isLoading
          : false,
  };
};
