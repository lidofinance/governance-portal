import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { MotionType } from '../motion-types';
import { EvmUnrecognized } from '../evm-addresses';
import { useLidoSDK } from 'providers/lido-sdk';
import { GovernanceToken } from 'shared/blockchain/contracts';
import { DAI, StETH } from 'shared/blockchain/contract-addresses';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';

const TOKEN = {
  [MotionType.LegoLDOTopUp]: {
    label: 'LDO',
    value: (chainId: CHAINS) => GovernanceToken.chainAddressMap[chainId],
  },
  [MotionType.LegoDAITopUp]: {
    label: 'DAI',
    value: (chainId: CHAINS) => DAI[chainId],
  },
  [MotionType.RccDAITopUp]: {
    label: 'DAI',
    value: (chainId: CHAINS) => DAI[chainId],
  },
  [MotionType.PmlDAITopUp]: {
    label: 'DAI',
    value: (chainId: CHAINS) => DAI[chainId],
  },
  [MotionType.AtcDAITopUp]: {
    label: 'DAI',
    value: (chainId: CHAINS) => DAI[chainId],
  },
  [MotionType.GasFunderETHTopUp]: {
    label: 'ETH',
    value: () => '0x0000000000000000000000000000000000000000',
  },
  [MotionType.AllowedRecipientTopUp]: {
    label: 'LDO',
    value: (chainId: CHAINS) => GovernanceToken.chainAddressMap[chainId],
  },
  [MotionType.AllowedRecipientTopUpReferralDai]: {
    label: 'DAI',
    value: (chainId: CHAINS) => DAI[chainId],
  },
  [MotionType.AllowedRecipientTopUpTrpLdo]: {
    label: 'LDO',
    value: (chainId: CHAINS) => GovernanceToken.chainAddressMap[chainId],
  },
  [MotionType.StethRewardProgramTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => StETH[chainId],
  },
  [MotionType.StethGasSupplyTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => StETH[chainId],
  },
  [MotionType.RewardsShareProgramTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => StETH[chainId],
  },
  [MotionType.RccStethTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => StETH[chainId],
  },
  [MotionType.PmlStethTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => StETH[chainId],
  },
  [MotionType.AtcStethTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => StETH[chainId],
  },
  [MotionType.StonksStethTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => StETH[chainId],
  },
  [MotionType.EcosystemOpsStethTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => StETH[chainId],
  },
  [MotionType.LabsOpsStethTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => StETH[chainId],
  },
  [MotionType.SandboxStethTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => StETH[chainId],
  },
};

const isTopUpType = (type: unknown): type is keyof typeof TOKEN => {
  if (typeof type !== 'string') return false;
  return type in TOKEN;
};

export const useTokenByTopUpType = ({
  registryType,
}: {
  registryType: MotionType | EvmUnrecognized;
}) => {
  const { chainId } = useLidoSDK();
  const { data: tokenData } = useGovernanceToken();

  const governanceAddress = GovernanceToken.chainAddressMap[chainId];

  if (
    registryType === MotionType.LegoLDOTopUp ||
    registryType === MotionType.AllowedRecipientTopUp
  )
    return { label: tokenData?.symbol, address: governanceAddress };

  if (!isTopUpType(registryType)) return { label: '', address: '' };

  const label = TOKEN[registryType].label;
  const address = TOKEN[registryType].value(chainId) ?? '';

  return { label, address };
};
