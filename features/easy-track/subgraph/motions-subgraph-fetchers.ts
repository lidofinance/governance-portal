import { RawMotionSubgraph } from '../types';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { fetcherGraphql } from 'utils/fetcher-graphql';

type Response = {
  data: { motions: RawMotionSubgraph[] };
  errors?: { message: string }[];
};

export const getQuerySubgraphMotions = (
  arg: { skip?: number; first?: number; id?: string | number } = {},
) => `{
  motions(
    ${arg.skip !== undefined ? `skip: ${arg.skip}` : ''}
    ${arg.first !== undefined ? `first: ${arg.first}` : ''}
    orderBy: startDate
    orderDirection: desc
    where: ${
      arg.id
        ? `{ id: ${arg.id} }`
        : `{ status_in: ["CANCELED", "REJECTED", "ENACTED"] }`
    }
  ) {
    id
    evmScriptFactory
    creator
    duration
    startDate
    snapshotBlock
    objectionsThreshold
    objectionsAmount
    evmScriptHash
    evmScriptCalldata
    status
    enacted_at
    canceled_at
    rejected_at
  }
}`;

export const fetchMotionsSubgraphList = async (
  chainId: CHAINS,
  query: string,
) => {
  const res = await fetcherGraphql<Response>(chainId, query);
  if (res.errors) throw new Error(res.errors[0].message);
  return res.data.motions;
};

export const fetchMotionsSubgraphItem = async (
  chainId: CHAINS,
  id: string | number,
) => {
  const res = await fetcherGraphql<Response>(
    chainId,
    getQuerySubgraphMotions({ id }),
  );
  return res.data.motions[0] || null;
};
