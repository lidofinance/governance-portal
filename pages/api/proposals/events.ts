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
import {
  CachedEventsData,
  ProposalEventsSubset,
} from 'features/dual-governance/proposals/types';

const JSON_PATH = path.join(
  process.cwd(),
  'public',
  'proposals-events-data.json',
);

const MAX_PROPOSAL_IDS = 500;

// Module-level cache: null = not loaded yet; populated lazily, no TTL (file
// only changes on deploy via the build script).
let cachedFileData: CachedEventsData | null = null;

const loadFileData = async (): Promise<CachedEventsData> => {
  if (cachedFileData !== null) {
    return cachedFileData;
  }

  const raw = await readFile(JSON_PATH, 'utf8');
  cachedFileData = JSON.parse(raw) as CachedEventsData;
  return cachedFileData;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chainId, proposalIds } = req.query;

  const chainIdNum = parseInt(chainId as string, 10);
  if (
    !chainId ||
    typeof chainId !== 'string' ||
    isNaN(chainIdNum) ||
    !config.supportedChains.includes(chainIdNum)
  ) {
    return res.status(400).json({ message: 'Invalid chainId' });
  }

  if (!proposalIds || typeof proposalIds !== 'string') {
    return res.status(400).json({ message: 'proposalIds is required' });
  }

  const ids = proposalIds
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (ids.length === 0 || ids.length > MAX_PROPOSAL_IDS) {
    return res
      .status(400)
      .json({ message: `proposalIds must be 1–${MAX_PROPOSAL_IDS} values` });
  }

  for (const id of ids) {
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: `Invalid proposalId: ${id}` });
    }
  }

  let allData: CachedEventsData;
  try {
    allData = await loadFileData();
  } catch (err) {
    return res
      .status(503)
      .json({ message: 'Proposals events data unavailable' });
  }
  const chainProposals = allData[chainIdNum.toString()]?.proposals ?? {};

  const result: ProposalEventsSubset = {};
  for (const id of ids) {
    const entry = chainProposals[id];
    if (entry !== undefined) {
      result[id] = entry;
    }
  }

  return res.status(200).json(result);
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.PROPOSALS_EVENTS),
  defaultErrorHandler,
])(handler);
