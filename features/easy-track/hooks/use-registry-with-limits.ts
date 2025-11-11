import { useMemo } from 'react';

import { MotionType } from 'features/easy-track/motion-types';
import {
  AllianceOpsStablesAllowedRecipientsRegistry,
  AllowedRecipientReferralDaiRegistry,
  AllowedRecipientRegistry,
  AllowedRecipientTrpLdoRegistry,
  AtcStablesRegistry,
  AtcStethAllowedRecipientsRegistry,
  EcosystemOpsStablesAllowedRecipientsRegistry,
  EcosystemOpsStethAllowedRecipientsRegistry,
  GasFunderETHRegistry,
  LabsOpsStablesAllowedRecipientsRegistry,
  LabsOpsStethAllowedRecipientsRegistry,
  LegoLDORegistry,
  LegoStablesRegistry,
  PmlStablesRegistry,
  PmlStethAllowedRecipientsRegistry,
  RccStablesRegistry,
  RccStethAllowedRecipientsRegistry,
  RewardsShareProgramRegistry,
  SandboxStablesAllowedRecipientRegistry,
  StethGasSupplyRegistry,
  StethRewardProgramRegistry,
  StonksStablesAllowedRecipientsRegistry,
  StonksStethAllowedRecipientsRegistry,
} from 'shared/blockchain/contracts';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Address } from 'viem';
import { usePeriodLimitsInfo } from './use-period-limits-info';

export type AllowedRecipient = {
  title: string;
  address: string;
};

export const REGISTRY_WITH_LIMITS_BY_MOTION_TYPE = {
  [MotionType.LegoLDOTopUp]: LegoLDORegistry,
  [MotionType.LegoDAITopUp]: LegoStablesRegistry,
  [MotionType.RccDAITopUp]: RccStablesRegistry,
  [MotionType.PmlDAITopUp]: PmlStablesRegistry,
  [MotionType.AtcDAITopUp]: AtcStablesRegistry,
  [MotionType.GasFunderETHTopUp]: GasFunderETHRegistry,
  [MotionType.AllowedRecipientTopUp]: AllowedRecipientRegistry,
  [MotionType.AllowedRecipientRemove]: AllowedRecipientRegistry,
  [MotionType.AllowedRecipientAdd]: AllowedRecipientRegistry,
  [MotionType.AllowedRecipientTopUpReferralDai]:
    AllowedRecipientReferralDaiRegistry,
  [MotionType.AllowedRecipientRemoveReferralDai]:
    AllowedRecipientReferralDaiRegistry,
  [MotionType.AllowedRecipientAddReferralDai]:
    AllowedRecipientReferralDaiRegistry,
  [MotionType.AllowedRecipientTopUpTrpLdo]: AllowedRecipientTrpLdoRegistry,
  [MotionType.StethRewardProgramAdd]: StethRewardProgramRegistry,
  [MotionType.StethRewardProgramRemove]: StethRewardProgramRegistry,
  [MotionType.StethRewardProgramTopUp]: StethRewardProgramRegistry,
  [MotionType.StethGasSupplyAdd]: StethGasSupplyRegistry,
  [MotionType.StethGasSupplyRemove]: StethGasSupplyRegistry,
  [MotionType.StethGasSupplyTopUp]: StethGasSupplyRegistry,
  [MotionType.RewardsShareProgramAdd]: RewardsShareProgramRegistry,
  [MotionType.RewardsShareProgramRemove]: RewardsShareProgramRegistry,
  [MotionType.RewardsShareProgramTopUp]: RewardsShareProgramRegistry,
  [MotionType.RccStablesTopUp]: RccStablesRegistry,
  [MotionType.PmlStablesTopUp]: PmlStablesRegistry,
  [MotionType.AtcStablesTopUp]: AtcStablesRegistry,
  [MotionType.SandboxStablesAdd]: SandboxStablesAllowedRecipientRegistry,
  [MotionType.SandboxStablesRemove]: SandboxStablesAllowedRecipientRegistry,
  [MotionType.SandboxStablesTopUp]: SandboxStablesAllowedRecipientRegistry,
  [MotionType.RccStethTopUp]: RccStethAllowedRecipientsRegistry,
  [MotionType.PmlStethTopUp]: PmlStethAllowedRecipientsRegistry,
  [MotionType.AtcStethTopUp]: AtcStethAllowedRecipientsRegistry,
  [MotionType.LegoStablesTopUp]: LegoStablesRegistry,
  [MotionType.StonksStethTopUp]: StonksStethAllowedRecipientsRegistry,
  [MotionType.StonksStablesTopUp]: StonksStablesAllowedRecipientsRegistry,
  [MotionType.AllianceOpsStablesTopUp]:
    AllianceOpsStablesAllowedRecipientsRegistry,
  [MotionType.EcosystemOpsStablesTopUp]:
    EcosystemOpsStablesAllowedRecipientsRegistry,
  [MotionType.EcosystemOpsStethTopUp]:
    EcosystemOpsStethAllowedRecipientsRegistry,
  [MotionType.LabsOpsStablesTopUp]: LabsOpsStablesAllowedRecipientsRegistry,
  [MotionType.LabsOpsStethTopUp]: LabsOpsStethAllowedRecipientsRegistry,
} as const;

type HookArgs = {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE;
};

const useRecipientMap = (
  programs: UseQueryResult<AllowedRecipient[] | null>,
) => {
  const result = useMemo(() => {
    if (!programs.data) return null;
    return programs.data.reduce(
      (res, p) => ({ [p.address]: p.title, ...res }),
      {} as Record<string, string>,
    );
  }, [programs.data]);

  return {
    ...programs,
    data: result,
  };
};

export const useAllowedRecipients = ({ registryType }: HookArgs) => {
  const { chainId } = useLidoSDK();
  const registry = useReadContract(
    REGISTRY_WITH_LIMITS_BY_MOTION_TYPE[registryType],
  );

  return useQuery({
    queryKey: ['allowed-recipients', chainId, registry.address],
    queryFn: async () => {
      const addresses = await registry.readContract('getAllowedRecipients');
      return addresses.map((address: Address) => ({ title: address, address }));
    },
  });
};

export const useRecipientMapAll = ({ registryType }: HookArgs) => {
  const partners = useAllowedRecipients({ registryType });
  return useRecipientMap(partners);
};

export const usePeriodLimitsData = ({ registryType }: HookArgs) => {
  const registry = useReadContract(
    REGISTRY_WITH_LIMITS_BY_MOTION_TYPE[registryType],
  );
  return usePeriodLimitsInfo({
    contract: registry,
  });
};

const TOKEN_BY_MOTION_TYPE: Record<
  keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE,
  { label: string; decimals: number }
> = {
  [MotionType.LegoLDOTopUp]: { label: 'LDO', decimals: 18 },
  [MotionType.LegoDAITopUp]: { label: 'DAI', decimals: 18 },
  [MotionType.RccDAITopUp]: { label: 'DAI', decimals: 18 },
  [MotionType.PmlDAITopUp]: { label: 'DAI', decimals: 18 },
  [MotionType.AtcDAITopUp]: { label: 'DAI', decimals: 18 },
  [MotionType.GasFunderETHTopUp]: { label: 'ETH', decimals: 18 },
  [MotionType.AllowedRecipientTopUp]: { label: 'LDO', decimals: 18 },
  [MotionType.AllowedRecipientRemove]: { label: 'LDO', decimals: 18 },
  [MotionType.AllowedRecipientAdd]: { label: 'LDO', decimals: 18 },
  [MotionType.AllowedRecipientTopUpReferralDai]: { label: 'DAI', decimals: 18 },
  [MotionType.AllowedRecipientRemoveReferralDai]: { label: 'DAI', decimals: 18 },
  [MotionType.AllowedRecipientAddReferralDai]: { label: 'DAI', decimals: 18 },
  [MotionType.AllowedRecipientTopUpTrpLdo]: { label: 'LDO', decimals: 18 },
  [MotionType.StethRewardProgramAdd]: { label: 'stETH', decimals: 18 },
  [MotionType.StethRewardProgramRemove]: { label: 'stETH', decimals: 18 },
  [MotionType.StethRewardProgramTopUp]: { label: 'stETH', decimals: 18 },
  [MotionType.StethGasSupplyAdd]: { label: 'stETH', decimals: 18 },
  [MotionType.StethGasSupplyRemove]: { label: 'stETH', decimals: 18 },
  [MotionType.StethGasSupplyTopUp]: { label: 'stETH', decimals: 18 },
  [MotionType.RewardsShareProgramAdd]: { label: 'stETH', decimals: 18 },
  [MotionType.RewardsShareProgramRemove]: { label: 'stETH', decimals: 18 },
  [MotionType.RewardsShareProgramTopUp]: { label: 'stETH', decimals: 18 },
  [MotionType.RccStablesTopUp]: { label: 'Stablecoins', decimals: 18 },
  [MotionType.PmlStablesTopUp]: { label: 'Stablecoins', decimals: 18 },
  [MotionType.AtcStablesTopUp]: { label: 'Stablecoins', decimals: 18 },
  [MotionType.SandboxStablesAdd]: { label: 'Stablecoins', decimals: 18 },
  [MotionType.SandboxStablesRemove]: { label: 'Stablecoins', decimals: 18 },
  [MotionType.SandboxStablesTopUp]: { label: 'Stablecoins', decimals: 18 },
  [MotionType.RccStethTopUp]: { label: 'stETH', decimals: 18 },
  [MotionType.PmlStethTopUp]: { label: 'stETH', decimals: 18 },
  [MotionType.AtcStethTopUp]: { label: 'stETH', decimals: 18 },
  [MotionType.LegoStablesTopUp]: { label: 'Stablecoins', decimals: 18 },
  [MotionType.StonksStethTopUp]: { label: 'stETH', decimals: 18 },
  [MotionType.StonksStablesTopUp]: { label: 'Stablecoins', decimals: 18 },
  [MotionType.AllianceOpsStablesTopUp]: { label: 'Stablecoins', decimals: 18 },
  [MotionType.EcosystemOpsStablesTopUp]: { label: 'Stablecoins', decimals: 18 },
  [MotionType.EcosystemOpsStethTopUp]: { label: 'stETH', decimals: 18 },
  [MotionType.LabsOpsStablesTopUp]: { label: 'Stablecoins', decimals: 18 },
  [MotionType.LabsOpsStethTopUp]: { label: 'stETH', decimals: 18 },
};

export const useTokenByTopUpType = ({ registryType }: HookArgs) => {
  return TOKEN_BY_MOTION_TYPE[registryType] || { label: 'Token', decimals: 18 };
};
