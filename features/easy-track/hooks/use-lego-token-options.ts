import { useMemo } from 'react';
import { useLidoSDK } from 'providers/lido-sdk';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { DaoToken, StETH } from 'shared/blockchain/contracts';
import { useConfig } from 'config';
import { isTestnet as getIsTestnet } from 'shared/blockchain/utils/is-testnet';
import { Address } from 'viem';
import * as CONTRACT_ADDRESSES from 'shared/blockchain/contract-addresses';

export const useLegoTokenOptions = () => {
  const { chainId } = useLidoSDK();
  const { userConfig } = useConfig();
  const { data: governanceToken } = useGovernanceToken();

  const isTestnet = getIsTestnet(chainId);
  const isInTestMode = userConfig.savedUserConfig.useTestContracts && isTestnet;

  return useMemo(() => {
    const daoTokenAddress = getContractAddress(DaoToken, chainId, isInTestMode);
    const stethAddress = getContractAddress(StETH, chainId, isInTestMode);

    // DAI doesn't have a contract object, so we resolve it manually
    const daiAddressRaw = CONTRACT_ADDRESSES.DAI[chainId];
    const daiAddress: Address = daiAddressRaw
      ? typeof daiAddressRaw === 'string'
        ? daiAddressRaw
        : isInTestMode
          ? daiAddressRaw.test
          : daiAddressRaw.actual
      : '0x0000000000000000000000000000000000000000';

    return [
      {
        label: 'ETH',
        value: '0x0000000000000000000000000000000000000000' as Address,
      },
      {
        label: governanceToken?.symbol || 'LDO',
        value: daoTokenAddress,
      },
      {
        label: 'stETH',
        value: stethAddress,
      },
      {
        label: 'DAI',
        value: daiAddress,
      },
    ];
  }, [governanceToken?.symbol, chainId, isInTestMode]);
};
