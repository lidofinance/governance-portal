import { readFile } from 'fs/promises';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import {
  defaultErrorHandler,
  HttpMethod,
  httpMethodGuard,
  rateLimit,
  responseTimeMetric,
} from 'utils-api';
import Metrics from 'utils-api/metrics';
import { API_ROUTES } from 'constants/api';
import { config } from 'config';
import type { CachedVoteEventsData, VoteEventsSubset } from './types';

const JSON_PATH = path.join(process.cwd(), 'public', 'votes-events-data.json');

const MAX_VOTE_IDS = 5;

// Module-level cache: null = not loaded yet; populated lazily, no TTL (file
// only changes on deploy via the build script).
let cachedFileData: CachedVoteEventsData | null = null;

const loadFileData = async (): Promise<CachedVoteEventsData> => {
  if (cachedFileData !== null) {
    return cachedFileData;
  }

  const raw = await readFile(JSON_PATH, 'utf8');
  cachedFileData = JSON.parse(raw) as CachedVoteEventsData;
  return cachedFileData;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chainId, votingAddress, voteIds } = req.query;

  const chainIdNum = parseInt(chainId as string, 10);
  if (
    !chainId ||
    typeof chainId !== 'string' ||
    isNaN(chainIdNum) ||
    !config.supportedChains.includes(chainIdNum)
  ) {
    return res.status(400).json({ message: 'Invalid chainId' });
  }

  if (!votingAddress || typeof votingAddress !== 'string') {
    return res.status(400).json({ message: 'votingAddress is required' });
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(votingAddress)) {
    return res.status(400).json({ message: 'Invalid votingAddress' });
  }

  if (!voteIds || typeof voteIds !== 'string') {
    return res.status(400).json({ message: 'voteIds is required' });
  }

  const ids = voteIds
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (ids.length === 0 || ids.length > MAX_VOTE_IDS) {
    return res
      .status(400)
      .json({ message: `voteIds must be 1–${MAX_VOTE_IDS} values` });
  }

  for (const id of ids) {
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: `Invalid voteId: ${id}` });
    }
  }

  let allData: CachedVoteEventsData;
  try {
    allData = await loadFileData();
  } catch {
    return res.status(503).json({ message: 'Votes events data unavailable' });
  }

  const chainData = allData[chainIdNum.toString()] ?? {};
  const addressVotes = chainData[votingAddress]?.votes ?? {};

  const result: VoteEventsSubset = {};
  for (const id of ids) {
    const entry = addressVotes[id];
    if (entry !== undefined) {
      result[id] = entry;
    }
  }

  return res.status(200).json(result);
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.VOTES_EVENTS),
  defaultErrorHandler,
])(handler);
