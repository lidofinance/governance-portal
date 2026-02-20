import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { standardFetcher } from './standard-fetcher';

const SUBGRAPH_ENDPOINT = '/api/subgraph';

export const fetcherGraphql = <T>(chainId: CHAINS, query: string) => {
  return standardFetcher<T>(`${SUBGRAPH_ENDPOINT}?chainId=${chainId}`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
};
