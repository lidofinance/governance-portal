import { getLogs } from 'viem/actions';
import { Address, Log, PublicClient } from 'viem';
import { findAbiItem } from 'utils/find-abi-item';
import { votingAbi } from 'abi/ts';

type Args = {
  address: Address | undefined;
  client: PublicClient;
  voteId: bigint;
  block: bigint;
};

export type StartVoteEventArgs = {
  voteId: bigint;
  creator: Address;
  metadata: string;
};

type ReturnType = Log & {
  args: StartVoteEventArgs;
};

export const getEventStartVote = async ({
  address,
  client,
  voteId,
  block,
}: Args): Promise<StartVoteEventArgs | null> => {
  try {
    const startVoteEventAbi = findAbiItem({
      abi: votingAbi,
      name: 'StartVote',
      type: 'event',
    });

    const events = (await getLogs(client, {
      address,
      event: startVoteEventAbi,
      args: {
        voteId,
      },
      fromBlock: block,
      toBlock: block + 1n,
    })) as ReturnType[];

    if (events.length === 0) {
      return null;
    }

    const event = events[0];

    return event.args;
  } catch (e) {
    console.error(e);
    return null;
  }
};
