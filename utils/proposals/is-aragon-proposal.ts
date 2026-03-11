import { decodeEventLog, keccak256, PublicClient, stringToBytes } from 'viem';
import { Voting } from 'shared/blockchain/contracts';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { findAbiItem } from '../find-abi-item';
import invariant from 'tiny-invariant';
import { getContractAddress } from 'shared/blockchain/get-contract-address';

type Props = {
  client: PublicClient;
  proposalLog: { transactionHash: `0x${string}` | null };
  chainId: CHAINS;
  isInTestMode?: boolean;
};

export const isAragonProposal = async ({
  client,
  proposalLog,
  chainId,
  isInTestMode,
}: Props): Promise<bigint | false> => {
  invariant(proposalLog, 'Proposal log is required');
  if (!proposalLog.transactionHash) return false;

  const receipt = await client.getTransactionReceipt({
    hash: proposalLog.transactionHash,
  });

  const aragonAddress = getContractAddress(Voting, chainId, isInTestMode);

  if (!aragonAddress) {
    console.warn(`No Aragon voting contract address for chainId: ${chainId}`);
    return false;
  }

  const aragonEvents = receipt.logs.filter(
    (log) => log.address.toLowerCase() === aragonAddress.toLowerCase(),
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
          return decoded.args.voteId;
        }
      } catch (error) {
        console.error(`isAragonProposal error: ${error}`);
      }
    }
  }

  return false;
};
