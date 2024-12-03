import { config } from 'config';

export const enum API_ROUTES {
  ETH_APR = 'api/eth-apr',
  ETH_PRICE = 'api/eth-price',
  RPC = 'api/rpc',
  METRICS = 'api/metrics',
}

export const enum ETH_API_ROUTES {
  ETH_APR = '/v1/protocol/eth/apr/last',
  ETH_PRICE = '/v1/protocol/eth/price',
}

export const getEthApiPath = (
  endpoint: ETH_API_ROUTES,
  params?:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined,
) => {
  let search = new URLSearchParams(params).toString();
  search = search ? '?' + search : '';
  return config.ethAPIBasePath + endpoint + search;
};

export const getReplacementLink = (apiRoute: API_ROUTES): string => {
  switch (apiRoute) {
    case API_ROUTES.ETH_APR:
      return getEthApiPath(ETH_API_ROUTES.ETH_APR);
    case API_ROUTES.ETH_PRICE:
      return getEthApiPath(ETH_API_ROUTES.ETH_PRICE);
    default:
      throw new Error(`No replacement link found for route: ${apiRoute}`);
  }
};
