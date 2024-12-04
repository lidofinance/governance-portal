import { PublicClient, Address, Abi, Log, AbiEvent } from 'viem';

interface EventsConfig {
  address: Address;
  abi: Abi;
  eventName: string;
  args?: Record<string, any> | undefined;
}

export const findEventInReverse = async (
  client: PublicClient,
  { address, abi, eventName, args }: EventsConfig,
  batchSize = 10000n,
): Promise<Log | null> => {
  let latestBlock = await client.getBlockNumber();

  while (latestBlock > 0) {
    const fromBlock = latestBlock >= batchSize ? latestBlock - batchSize : 0n;
    const toBlock = latestBlock;

    const eventAbi = abi.find(
      (x) => x.type === 'event' && x.name === eventName,
    ) as AbiEvent | undefined;

    const logs = await client.getLogs({
      address,
      event: eventAbi,
      fromBlock,
      toBlock,
      args,
    });

    if (logs.length > 0) {
      return logs[0];
    }

    latestBlock = fromBlock - 1n;
  }

  return null;
};
