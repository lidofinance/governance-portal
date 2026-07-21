import type { PublicClient } from 'viem';
import { fetchLogsInParallelChunks } from 'utils/fetch-logs-in-parallel';

const dummyEvent = { type: 'event', name: 'Test', inputs: [] };
const address = '0x0000000000000000000000000000000000000001' as const;

// large range => forced to chunk when the single request fails
const FROM_BLOCK = 0n;
const TO_BLOCK = 50_000n;

const makeClient = (getLogs: jest.Mock) =>
  ({ getLogs }) as unknown as PublicClient;

// full-range = the single attempt; every chunk is a strict sub-range
const isFullRange = (filter: { fromBlock: bigint; toBlock: bigint }) =>
  filter.fromBlock === FROM_BLOCK && filter.toBlock === TO_BLOCK;

describe('fetchLogsInParallelChunks', () => {
  test('happy path: a single request for the whole range, no chunking', async () => {
    const logs = [{ id: 'a' }, { id: 'b' }];
    const getLogs = jest.fn().mockResolvedValue(logs);

    const result = await fetchLogsInParallelChunks({
      client: makeClient(getLogs),
      address,
      event: dummyEvent,
      fromBlock: FROM_BLOCK,
      toBlock: TO_BLOCK,
    });

    expect(result).toBe(logs);
    expect(getLogs).toHaveBeenCalledTimes(1);
  });

  test('passes address, event and args through to getLogs', async () => {
    const getLogs = jest.fn().mockResolvedValue([]);
    const args = { voteId: 203n };

    await fetchLogsInParallelChunks({
      client: makeClient(getLogs),
      address,
      event: dummyEvent,
      fromBlock: FROM_BLOCK,
      toBlock: TO_BLOCK,
      args,
    });

    expect(getLogs).toHaveBeenCalledWith({
      address,
      event: dummyEvent,
      fromBlock: FROM_BLOCK,
      toBlock: TO_BLOCK,
      args,
    });
  });

  test('retries the full-range request before falling back to chunks', async () => {
    let fullRangeAttempts = 0;
    const getLogs = jest.fn().mockImplementation((filter: any) => {
      if (isFullRange(filter)) {
        fullRangeAttempts += 1;
        return Promise.reject(new Error('transient'));
      }
      return Promise.resolve([{ id: `${filter.fromBlock}` }]);
    });

    const result = await fetchLogsInParallelChunks<{ id: string }>({
      client: makeClient(getLogs),
      address,
      event: dummyEvent,
      fromBlock: FROM_BLOCK,
      toBlock: TO_BLOCK,
    });

    // full-range request retried GET_LOGS_RETRY_COUNT times before chunking
    expect(fullRangeAttempts).toBe(3);
    // 50001 blocks / 4999 => 11 chunks, all aggregated
    expect(result).toHaveLength(11);
  });

  test('normalizes a degenerate chunkCount (0) instead of dividing by zero', async () => {
    const getLogs = jest.fn().mockImplementation((filter: any) => {
      if (isFullRange(filter)) {
        return Promise.reject(new Error('range too large'));
      }
      return Promise.resolve([{ id: `${filter.fromBlock}` }]);
    });

    const result = await fetchLogsInParallelChunks<{ id: string }>({
      client: makeClient(getLogs),
      address,
      event: dummyEvent,
      fromBlock: FROM_BLOCK,
      toBlock: TO_BLOCK,
      chunkCount: 0,
    });

    // clamped to a valid count, no throw, full aggregate (11 chunks of <=4999)
    expect(result).toHaveLength(11);
  });

  test('caps concurrent chunk requests at CHUNK_CONCURRENCY (3)', async () => {
    let inFlight = 0;
    let peakInFlight = 0;
    const getLogs = jest.fn().mockImplementation((filter: any) => {
      if (isFullRange(filter)) {
        return Promise.reject(new Error('range too large'));
      }
      inFlight += 1;
      peakInFlight = Math.max(peakInFlight, inFlight);
      return new Promise((resolve) => {
        setTimeout(() => {
          inFlight -= 1;
          resolve([{ id: `${filter.fromBlock}` }]);
        }, 5);
      });
    });

    await fetchLogsInParallelChunks({
      client: makeClient(getLogs),
      address,
      event: dummyEvent,
      fromBlock: FROM_BLOCK,
      toBlock: TO_BLOCK,
    });

    expect(peakInFlight).toBe(3);
  });

  test('rejects (does not swallow) when a chunk fails persistently', async () => {
    const getLogs = jest.fn().mockImplementation((filter: any) => {
      if (isFullRange(filter)) {
        return Promise.reject(new Error('range too large'));
      }
      // every chunk fails on every retry
      return Promise.reject(new Error('rate limited'));
    });

    await expect(
      fetchLogsInParallelChunks({
        client: makeClient(getLogs),
        address,
        event: dummyEvent,
        fromBlock: FROM_BLOCK,
        toBlock: TO_BLOCK,
      }),
    ).rejects.toThrow('rate limited');
  });

  test('rejects when ONE chunk fails persistently while the others succeed (no partial result)', async () => {
    const getLogs = jest.fn().mockImplementation((filter: any) => {
      if (isFullRange(filter)) {
        return Promise.reject(new Error('range too large'));
      }
      // one specific chunk always fails; every other chunk succeeds
      if (filter.fromBlock === 0n) {
        return Promise.reject(new Error('chunk 0 down'));
      }
      return Promise.resolve([{ id: `${filter.fromBlock}` }]);
    });

    await expect(
      fetchLogsInParallelChunks({
        client: makeClient(getLogs),
        address,
        event: dummyEvent,
        fromBlock: FROM_BLOCK,
        toBlock: TO_BLOCK,
      }),
    ).rejects.toThrow('chunk 0 down');
  });

  test('retries a transiently failing chunk and still returns the full set', async () => {
    let firstChunkFailures = 0;
    const getLogs = jest.fn().mockImplementation((filter: any) => {
      if (isFullRange(filter)) {
        return Promise.reject(new Error('range too large'));
      }
      // make the very first chunk (fromBlock 0) fail twice, then succeed
      if (filter.fromBlock === 0n && firstChunkFailures < 2) {
        firstChunkFailures += 1;
        return Promise.reject(new Error('transient'));
      }
      return Promise.resolve([{ id: `${filter.fromBlock}` }]);
    });

    const result = await fetchLogsInParallelChunks<{ id: string }>({
      client: makeClient(getLogs),
      address,
      event: dummyEvent,
      fromBlock: FROM_BLOCK,
      toBlock: TO_BLOCK,
    });

    // all 11 chunks resolve (the failing one recovered on its 3rd attempt)
    expect(result).toHaveLength(11);
    expect(firstChunkFailures).toBe(2);
  });

  test('returnOnFirstMatch: returns the first non-empty chunk newest-first', async () => {
    const getLogs = jest.fn().mockImplementation((filter: any) => {
      // only the newest chunk (ending at TO_BLOCK) has a log
      if (filter.toBlock === TO_BLOCK) {
        return Promise.resolve([{ id: 'newest' }]);
      }
      return Promise.resolve([]);
    });

    const result = await fetchLogsInParallelChunks<{ id: string }>({
      client: makeClient(getLogs),
      address,
      event: dummyEvent,
      fromBlock: FROM_BLOCK,
      toBlock: TO_BLOCK,
      returnOnFirstMatch: true,
    });

    expect(result).toEqual([{ id: 'newest' }]);
    // newest chunk is scanned first, so it returns after the first call
    expect(getLogs).toHaveBeenCalledTimes(1);
  });

  test('returnOnFirstMatch: resolves to [] when every chunk is empty', async () => {
    const getLogs = jest.fn().mockResolvedValue([]);

    const result = await fetchLogsInParallelChunks({
      client: makeClient(getLogs),
      address,
      event: dummyEvent,
      fromBlock: FROM_BLOCK,
      toBlock: TO_BLOCK,
      returnOnFirstMatch: true,
    });

    expect(result).toEqual([]);
    // scans every chunk (11) since none matched
    expect(getLogs).toHaveBeenCalledTimes(11);
  });

  test('returnOnFirstMatch: rejects when a scanned chunk fails persistently', async () => {
    const getLogs = jest.fn().mockRejectedValue(new Error('newest chunk down'));

    await expect(
      fetchLogsInParallelChunks({
        client: makeClient(getLogs),
        address,
        event: dummyEvent,
        fromBlock: FROM_BLOCK,
        toBlock: TO_BLOCK,
        returnOnFirstMatch: true,
      }),
    ).rejects.toThrow('newest chunk down');
  });
});
