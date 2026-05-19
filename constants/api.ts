export const enum API_ROUTES {
  RPC = 'api/rpc',
  METRICS = 'api/metrics',
  KEYS_INFO = 'api/node-operators/keys-info',
  COW_GET_ORDER = 'api/cow/get-order',
  COW_GET_TRADES = 'api/cow/get-trades',
  COW_PLACE_ORDER = 'api/cow/place-order',
  ETHERSCAN_BLOCK_BY_TIMESTAMP = 'api/etherscan/block-by-timestamp',
  ETHERSCAN = 'api/etherscan',
  PROPOSALS_EVENTS = 'api/proposals/events',
}

// pages/api/proposals/events.ts rejects requests with more than this many
// `proposalIds` with HTTP 400. Clients with a variable-length id list must
// chunk to this size before calling the route — fetchCachedProposalEvents does.
export const MAX_PROPOSAL_IDS = 500;
