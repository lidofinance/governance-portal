type Props = {
  fromBlock: bigint;
  toBlock: bigint;
};

// RPC getLogs max Range
const RANGE_STEP = 5000n;

/**
 *  This util is to expand search window for getLogs fetch up to ~15000 blocks
 *  We use it to find events based on blocks timestamps
 *  TODO: add a specific window range arg if necessary
 */
export const expandGetLogsSearchWindow = ({ fromBlock, toBlock }: Props) => {
  return [
    { fromBlock, toBlock },
    { fromBlock: fromBlock - RANGE_STEP, toBlock: fromBlock - 1n },
    { fromBlock: toBlock + 1n, toBlock: toBlock + RANGE_STEP },
  ];
};
