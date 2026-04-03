const FALLBACK_BLOCK_TIME_SECS = 12;
const EXECUTE_BUFFER_SECS = 604_800; // 1 week
// Safety margin to account for block time estimation error.
// ~6 hours at 12 sec/block — covers votes executed right at closing.
const ESTIMATION_MARGIN_BLOCKS = 1800n;

type Args = {
  snapshotBlock: bigint;
  startDate: bigint;
  voteTimeSecs: number;
  latestBlock: { number: bigint; timestamp: bigint };
};

export const estimateExecuteVoteBlockRange = ({
  snapshotBlock,
  startDate,
  voteTimeSecs,
  latestBlock,
}: Args): { fromBlock: bigint; toBlock: bigint; voteEndBlock: bigint } => {
  const elapsedBlocks = Number(latestBlock.number - snapshotBlock);
  const elapsedSecs = Number(latestBlock.timestamp - startDate);
  const blockTimeSecs =
    elapsedBlocks > 0 && elapsedSecs > 0
      ? elapsedSecs / elapsedBlocks
      : FALLBACK_BLOCK_TIME_SECS;
  const voteEndBlock =
    snapshotBlock + BigInt(Math.ceil(voteTimeSecs / blockTimeSecs));

  const fromBlock =
    voteEndBlock > snapshotBlock + ESTIMATION_MARGIN_BLOCKS
      ? voteEndBlock - ESTIMATION_MARGIN_BLOCKS
      : snapshotBlock;

  const rawToBlock =
    voteEndBlock + BigInt(Math.ceil(EXECUTE_BUFFER_SECS / blockTimeSecs));
  const toBlock =
    rawToBlock < latestBlock.number ? rawToBlock : latestBlock.number;

  return { fromBlock, toBlock, voteEndBlock };
};
