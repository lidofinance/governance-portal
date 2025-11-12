import { fetcherStandard } from './fetcher-standard';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

const SUBGRAPH_ENDPOINT = '/api/subgraph';

export const fetcherGraphql = <T>(chainId: CHAINS, query: string) => {
  return fetcherStandard<T>(`${SUBGRAPH_ENDPOINT}?chainId=${chainId}`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
};
