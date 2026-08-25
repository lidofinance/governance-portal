import { utils } from 'ethers';
import { KeysInfo } from 'features/easy-track/types';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  rateLimit,
  responseTimeMetric,
  errorAndCacheDefaultWrappers,
  httpMethodGuard,
  HttpMethod,
} from 'utils-api';
import Metrics from 'utils-api/metrics';
import { API_ROUTES } from 'constants/api';
import { parseChainId } from '../subgraph';

export type Module = {
  id: number;
  stakingModuleAddress: string;
};

export type KeysInfoOperatorNew = {
  id: number;
  active: boolean;
  name: string;
  rewardAddress: string;
  totalSigningKeys: number;
  usedSigningKeys: number;
  stakingLimit: number;
  stoppedValidators: number;
  unusedBellowStakingLimit: number;
  unusedOverStakingLimit: number;
  duplicates: string[];
  invalid: string[];
};

export type KeysInfoNew = {
  operators: undefined | KeysInfoOperatorNew[];
  summary: {
    moduleId: number;
  };
};

const requestTestnetOperators = async (chainId: number) => {
  const data = await fetch(
    `https://operators.testnet.fi/api/operators?chainId=${chainId}`,
  );
  return data.json();
};

const requestOperators = async (
  api:
    | 'https://operators.lido.fi/api'
    | 'https://operators-hoodi.testnet.fi/api',
  chainId: number,
  moduleAddress: string,
  walletAddress: string,
) => {
  const modulesResp = await fetch(`${api}/modules?chainId=${chainId}`);
  const modules: Module[] = await modulesResp.json();

  const stakingModule = modules.find(
    (item) =>
      utils.getAddress(item.stakingModuleAddress) ===
      utils.getAddress(moduleAddress),
  );
  const result: KeysInfo = {};
  if (!stakingModule) {
    return result;
  }
  const moduleStatisticsResp = await fetch(
    `${api}/moduleStatistics?moduleId=${stakingModule.id}&chainId=${chainId}`,
  );
  const moduleStatistics: KeysInfoNew = await moduleStatisticsResp.json();

  const operator = moduleStatistics.operators?.find(
    (item) =>
      utils.getAddress(item.rewardAddress) === utils.getAddress(walletAddress),
  );
  if (!operator) {
    return result;
  }

  const operatorStatisticsResp = await fetch(
    `${api}/operatorStatistics?moduleId=${stakingModule.id}&operatorId=${operator.id}&chainId=${chainId}`,
  );
  const operatorStatistics: KeysInfoOperatorNew =
    await operatorStatisticsResp.json();

  result.operators = [
    {
      invalid: operatorStatistics.invalid,
      duplicates: operatorStatistics.duplicates,
      info: {
        index: operatorStatistics.id,
        active: operatorStatistics.active,
        name: operatorStatistics.name,
        rewardAddress: operatorStatistics.rewardAddress,
        stakingLimit: operatorStatistics.stakingLimit,
        stoppedValidators: operatorStatistics.stoppedValidators,
        totalSigningKeys: operatorStatistics.totalSigningKeys,
        usedSigningKeys: operatorStatistics.usedSigningKeys,
      },
    },
  ];
  return result;
};

const keysInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  const chainId = parseChainId(String(req.query.chainId)) as CHAINS;
  const walletAddress = String(req.query.walletAddress);
  const moduleAddress = String(req.query.moduleAddress);

  const usesOperatorAddresses =
    chainId === CHAINS.Mainnet || chainId === CHAINS.Hoodi;
  if (
    usesOperatorAddresses &&
    (!utils.isAddress(moduleAddress) || !utils.isAddress(walletAddress))
  ) {
    res.status(400).json({ message: 'Invalid address' });
    return;
  }

  let result;
  switch (chainId) {
    case CHAINS.Mainnet:
      result = await requestOperators(
        'https://operators.lido.fi/api',
        chainId,
        moduleAddress,
        walletAddress,
      );
      break;
    case CHAINS.Hoodi:
      result = await requestOperators(
        'https://operators-hoodi.testnet.fi/api',
        chainId,
        moduleAddress,
        walletAddress,
      );
      break;
    default:
      result = await requestTestnetOperators(chainId);
  }

  res.json(result);
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.KEYS_INFO),
  ...errorAndCacheDefaultWrappers,
])(keysInfo);
