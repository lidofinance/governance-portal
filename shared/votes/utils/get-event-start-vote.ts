import { getLogs } from 'viem/actions';
import { Address, Hex, PublicClient } from 'viem';
import { findAbiItem } from 'utils/find-abi-item';
import { aragonVotingAbi } from 'abi/generated';

type Args = {
  address: Address | undefined;
  client: PublicClient;
  voteId: bigint;
  fromBlock: bigint;
};

export type StartVoteEventArgs = {
  voteId: bigint;
  creator: Address;
  metadata: string;
};

export type EventStartVote = {
  event: {
    transactionHash: Hex | null;
    blockNumber: bigint | null;
  };
  args: StartVoteEventArgs;
};

type GetEventStartVoteReturnType = Promise<EventStartVote>;

const startVoteEventAbi = findAbiItem({
  abi: aragonVotingAbi,
  name: 'StartVote',
  type: 'event',
});

export const getEventStartVote = async ({
  address,
  client,
  voteId,
  fromBlock,
}: Args): Promise<GetEventStartVoteReturnType | undefined> => {
  try {
    const events = await getLogs(client, {
      address,
      event: startVoteEventAbi,
      args: { voteId },
      fromBlock,
      toBlock: fromBlock + 1n,
      strict: true,
    });

    if (events.length === 0) {
      return;
    }

    const event = events[0];

    return { event, args: event.args };
  } catch (e) {
    console.error(e);
    return;
  }
};
