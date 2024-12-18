import { PublicClient, Address, Abi } from 'viem';
import { findAbiItem } from './find-abi-item';

interface EventsConfig<TLog> {
  address: Address;
  abi: Abi;
  eventName: string;
  args?: Record<string, any> | undefined;
  shouldStop?: (log: TLog) => boolean;
  batchSize?: bigint;
}

export const findAllEvents = async <TLog>(
  client: PublicClient,
  {
    address,
    abi,
    eventName,
    args,
    shouldStop,
    batchSize = 10000n,
  }: EventsConfig<TLog>,
): Promise<TLog[]> => {
  try {
    const latestBlock = await client.getBlockNumber();

    const eventAbi = findAbiItem({ abi, name: eventName, type: 'event' });
    if (!eventAbi) {
      console.error(`Event "${eventName}" not found in the provided ABI.`);
      return [];
    }

    const allLogs: TLog[] = [];

    for (
      let currentBlock = latestBlock;
      currentBlock > 0n;
      currentBlock -= batchSize
    ) {
      const fromBlock =
        currentBlock >= batchSize ? currentBlock - batchSize : 0n;
      const toBlock = currentBlock;

      try {
        const logs = (await client.getLogs({
          address,
          event: eventAbi,
          fromBlock,
          toBlock,
          args,
        })) as TLog[];

        for (const log of logs) {
          allLogs.push(log);

          if (shouldStop && shouldStop(log)) {
            console.log('Stop condition met.', shouldStop);
            return allLogs;
          }
        }
      } catch (blockError) {
        console.error(
          `Error fetching logs for block range ${fromBlock}-${toBlock}:`,
          blockError,
        );
      }
    }

    return allLogs;
  } catch (error) {
    console.error('Error finding events:', error);
    throw error;
  }
};
