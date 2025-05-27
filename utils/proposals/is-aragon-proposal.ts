import {
  decodeEventLog,
  Hex,
  keccak256,
  PublicClient,
  stringToBytes,
} from 'viem';
import { Voting } from 'shared/blockchain/contracts';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { findAbiItem } from '../find-abi-item';
import invariant from 'tiny-invariant';
import { MergedProposalSubmittedEvent } from '../../features/dual-governance/events/get-proposal-submitted-events';

type Props = {
  client: PublicClient;
  proposalLog: MergedProposalSubmittedEvent['DGEvent'] | null;
  chainId: CHAINS;
};

export const isAragonProposal = async ({
  client,
  proposalLog,
  chainId,
}: Props): Promise<bigint | false> => {
  invariant(proposalLog, 'Proposal log is required');
  if (!proposalLog.transactionHash) return false;

  const receipt = await client.getTransactionReceipt({
    hash: proposalLog.transactionHash as Hex,
  });
  const aragonAddress = Voting.chainAddressMap[chainId]?.toLowerCase();
  const aragonEvents = receipt.logs.filter(
    (log) => log.address.toLowerCase() === aragonAddress,
  );

  if (aragonEvents.length === 0) return false;

  const executeVoteEventSignature = keccak256(
    stringToBytes('ExecuteVote(uint256)'),
  );

  const executeVoteEventAbi = findAbiItem({
    abi: Voting.abi,
    name: 'ExecuteVote',
    type: 'event',
  });

  if (!executeVoteEventAbi) {
    return false;
  }

  for (const log of aragonEvents) {
    if (log.topics[0] === executeVoteEventSignature) {
      try {
        const decoded = decodeEventLog({
          abi: [executeVoteEventAbi],
          data: log.data,
          topics: log.topics,
        });

        if (
          decoded &&
          decoded.eventName === 'ExecuteVote' &&
          'voteId' in decoded.args
        ) {
          return decoded.args.voteId as bigint;
        }
      } catch (error) {
        console.error(`isAragonProposal error: ${error}`);
      }
    }
  }

  return false;
};
