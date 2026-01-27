import { KeysInfo } from '../types';
import {
  NodeOperatorsRegistryType,
  NODE_OPERATORS_REGISTRY_MAP,
  nodeOperatorsKeysInfo,
} from '../constants';
import { fetcherStandard } from 'utils/fetcher-standard';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';

export const useNodeOperatorKeysInfo = (
  registryType: NodeOperatorsRegistryType,
) => {
  const { chainId } = useLidoSDK();
  const { address: walletAddress } = useAccount();

  const moduleAddress =
    NODE_OPERATORS_REGISTRY_MAP[registryType].chainAddressMap[chainId];

  return useQuery({
    queryKey: [
      'node-operators-keys-info',
      chainId,
      walletAddress,
      moduleAddress,
    ],
    queryFn: () =>
      fetcherStandard<KeysInfo>(
        nodeOperatorsKeysInfo(chainId, `${walletAddress}`, `${moduleAddress}`),
      ),
    enabled: !!(chainId && walletAddress && moduleAddress),
  });
};
