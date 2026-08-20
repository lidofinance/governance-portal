import { RawMotionSubgraph } from '../types';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { fetcherGraphql } from 'utils/fetcher-graphql';

type Response = {
  data: { motions: RawMotionSubgraph[] };
  errors?: { message: string }[];
};

type MotionsQuery = {
  query: string;
  variables?: { factories: string[] };
};

export const getQuerySubgraphMotions = (
  arg: {
    skip?: number;
    first?: number;
    id?: string | number;
    evmScriptFactories?: string[];
  } = {},
): MotionsQuery => {
  const factories = arg.evmScriptFactories;
  const hasFactories = factories !== undefined;

  return {
    query: `${hasFactories ? 'query ($factories: [Bytes!]!) ' : ''}{
  motions(
    ${arg.skip !== undefined ? `skip: ${arg.skip}` : ''}
    ${arg.first !== undefined ? `first: ${arg.first}` : ''}
    orderBy: startDate
    orderDirection: desc
    where: ${
      arg.id
        ? `{ id: ${arg.id} }`
        : `{ status_in: ["CANCELED", "REJECTED", "ENACTED"]${
            hasFactories ? ', evmScriptFactory_in: $factories' : ''
          } }`
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
}`,
    variables: hasFactories ? { factories } : undefined,
  };
};

export const fetchMotionsSubgraphList = async (
  chainId: CHAINS,
  { query, variables }: MotionsQuery,
) => {
  const res = await fetcherGraphql<Response>(chainId, query, variables);
  if (res.errors) throw new Error(res.errors[0].message);
  return res.data.motions;
};

export const fetchMotionsSubgraphItem = async (
  chainId: CHAINS,
  id: string | number,
): Promise<RawMotionSubgraph | undefined> => {
  const res = await fetcherGraphql<Response>(
    chainId,
    getQuerySubgraphMotions({ id }).query,
  );
  return res.data.motions[0];
};
