import { PublicClient, Address, Abi, Log, AbiEvent } from 'viem';

interface EventsConfig {
  address: Address;
  abi: Abi;
  eventName: string;
  args?: Record<string, any> | undefined;
}

export const findEventByTimestamp = async (
  client: PublicClient,
  { address, abi, eventName, args }: EventsConfig,
  targetTimestamp: number,
): Promise<Log[] | null> => {
  let startBlock = 0n;
  let endBlock = await client.getBlockNumber();

  while (startBlock <= endBlock) {
    const midBlock = (startBlock + endBlock) / 2n;
    const block = await client.getBlock({ blockNumber: midBlock });

    if (Number(block.timestamp) === targetTimestamp) {
      startBlock = midBlock;
      break;
    } else if (Number(block.timestamp) < targetTimestamp) {
      startBlock = midBlock + 1n;
    } else {
      endBlock = midBlock - 1n;
    }
  }

  const eventAbi = abi.find(
    (x) => x.type === 'event' && x.name === eventName,
  ) as AbiEvent | undefined;

  if (!eventAbi) {
    throw new Error(`Event ${eventName} not found in ABI`);
  }

  const logs = await client.getLogs({
    address,
    event: eventAbi,
    args,
    fromBlock: startBlock,
    toBlock: startBlock,
  });

  return logs.length > 0 ? logs : [];
};
