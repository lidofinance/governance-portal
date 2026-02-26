import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { findAbiItem } from 'utils/find-abi-item';
import { EasyTrack } from 'shared/blockchain/contracts';
import { PublicClient } from 'viem';
import { easyTrackAbi } from 'abi/generated';

const GET_LOGS_RANGE = 2499n;

type Args = {
  client: PublicClient;
  easyTrackContract: ReturnType<typeof useReadContract<typeof easyTrackAbi>>;
  motionId: bigint;
  motionSnapshotBlock: bigint;
};

export const getMotionCreatedEvent = async ({
  easyTrackContract,
  motionId,
  motionSnapshotBlock,
  client,
}: Args) => {
  const eventAbi = findAbiItem({
    abi: EasyTrack.abi,
    name: 'MotionCreated',
    type: 'event',
  });

  const events = await client.getLogs({
    address: easyTrackContract.address,
    event: eventAbi,
    args: {
      _motionId: motionId,
    },
    fromBlock: motionSnapshotBlock - GET_LOGS_RANGE,
    toBlock: motionSnapshotBlock + GET_LOGS_RANGE,
  });

  return events[0];
};
