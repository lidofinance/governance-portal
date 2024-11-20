import { getLogs } from 'viem/actions';
import { Address, Log, PublicClient } from 'viem';

type Props = {
  address: Address | undefined;
  client: PublicClient;
  eventAbi: any;
  voteId: bigint;
  block: bigint;
};

type VoteEventArgs = {
  voteId: bigint;
  creator: string;
  metadata: string;
};

type ReturnType = Log & {
  args: VoteEventArgs;
};

export const getEventStartVote = async ({
  address,
  client,
  eventAbi,
  voteId,
  block,
}: Props): Promise<VoteEventArgs | null> => {
  try {
    const events = (await getLogs(client, {
      address,
      event: eventAbi,
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
  }
  return null;
};
