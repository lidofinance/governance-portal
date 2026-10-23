import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { findAbiItem } from 'utils/find-abi-item';
import { EasyTrack } from 'shared/blockchain/contracts';
import { Address, isAddressEqual, keccak256, Log, PublicClient } from 'viem';
import { easyTrackAbi } from 'abi/generated';

type MotionCreatedAbiEvent = Extract<
  (typeof easyTrackAbi)[number],
  { type: 'event'; name: 'MotionCreated' }
>;
export type MotionCreatedEventLog = Log<
  bigint,
  number,
  false,
  MotionCreatedAbiEvent,
  true
>;

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
    // EasyTrack sets snapshotBlock to the block that emits MotionCreated
    fromBlock: motionSnapshotBlock,
    toBlock: motionSnapshotBlock,
    strict: true,
  });

  return events[0];
};

export const isEventForMotion = (
  event: MotionCreatedEventLog,
  motion: { creator: string; evmScriptFactory: string; evmScriptHash: string },
) => {
  const isMatch =
    isAddressEqual(event.args._creator, motion.creator as Address) &&
    isAddressEqual(
      event.args._evmScriptFactory,
      motion.evmScriptFactory as Address,
    ) &&
    keccak256(event.args._evmScript) === motion.evmScriptHash.toLowerCase();

  if (!isMatch) {
    console.warn(
      `MotionCreated event does not match motion ${event.args._motionId}`,
    );
  }

  return isMatch;
};
