import {
  AllianceOpsStablesAllowedRecipientsRegistry,
  AllowedRecipientReferralDaiRegistry,
  AllowedRecipientRegistry,
  AllowedRecipientTrpLdoRegistry,
  AtcStablesRegistry,
  EasyTrack,
  GasFunderETHRegistry,
  LegoLDORegistry,
  LegoStablesRegistry,
  PmlStablesRegistry,
  RccStablesRegistry,
  StethRewardProgramRegistry,
} from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { ContractObject } from 'shared/blockchain/types';
import { MotionType } from '../motion-types';
import { EvmUnrecognized } from '../evm-addresses';
import { getLimits, LimitsType } from '../utils/get-limits';
import { getPeriodData, PeriodDataType } from '../utils/get-period-data';
import { calcPeriodData } from '../utils/calc-period-data';

type ContractLimitsMethods = {
  readContract: (functionName: string, ...args: any[]) => Promise<any>;
  address: string;
};

type UsePeriodLimitInfoProps<T> = {
  contract: T;
  isPending?: boolean;
};

export type UsePeriodLimitsInfoResultData = {
  limits: LimitsType;
  periodData: PeriodDataType;
  motionDuration: number;
  isEndInNextPeriod: boolean;
};

type UsePeriodLimitInfo = <T extends ContractLimitsMethods>(
  data: UsePeriodLimitInfoProps<T>,
) => ReturnType<typeof useQuery<UsePeriodLimitsInfoResultData>>;

const getPeriodLimitsInfo = async <T extends ContractLimitsMethods>(
  easyTrack: any,
  contract: T,
  isPending?: boolean,
) => {
  const [motionDuration, limits, periodData] = await Promise.all([
    easyTrack.readContract('motionDuration') as Promise<bigint>,
    getLimits(contract),
    getPeriodData(contract),
  ]);

  return calcPeriodData({
    motionDuration,
    limits,
    periodData,
    isPending,
  });
};

export const usePeriodLimitsInfo: UsePeriodLimitInfo = (props) => {
  const { contract, isPending } = props;
  const { address } = contract;
  const { chainId } = useLidoSDK();

  const easyTrack = useReadContract(EasyTrack);

  return useQuery({
    queryKey: ['period-limits', chainId, address],
    queryFn: async () => {
      return await getPeriodLimitsInfo(easyTrack, contract, isPending);
    },
    retry: 3,
  });
};

const isContractWithLimits = (
  contract: unknown,
): contract is ContractLimitsMethods => {
  if (typeof contract !== 'object' || contract === null) return false;
  return (
    'readContract' in contract &&
    typeof (contract as any).readContract === 'function'
  );
};

const registryByMotionType: {
  [key in MotionType | EvmUnrecognized]?: ContractObject;
} = {
  [MotionType.LegoLDOTopUp]: LegoLDORegistry,
  [MotionType.LegoDAITopUp]: LegoStablesRegistry,
  [MotionType.RccStablesTopUp]: RccStablesRegistry,
  [MotionType.PmlStablesTopUp]: PmlStablesRegistry,
  [MotionType.AtcStablesTopUp]: AtcStablesRegistry,
  [MotionType.RccDAITopUp]: RccStablesRegistry,
  [MotionType.PmlDAITopUp]: PmlStablesRegistry,
  [MotionType.AtcDAITopUp]: AtcStablesRegistry,
  [MotionType.GasFunderETHTopUp]: GasFunderETHRegistry,
  [MotionType.AllowedRecipientTopUp]: AllowedRecipientRegistry,
  [MotionType.AllowedRecipientTopUpReferralDai]:
    AllowedRecipientReferralDaiRegistry,
  [MotionType.AllowedRecipientTopUpTrpLdo]: AllowedRecipientTrpLdoRegistry,
  [MotionType.StethRewardProgramTopUp]: StethRewardProgramRegistry,
  [MotionType.LegoStablesTopUp]: LegoStablesRegistry,
  [MotionType.AllianceOpsStablesTopUp]:
    AllianceOpsStablesAllowedRecipientsRegistry,
};

export const usePeriodLimitsInfoByMotionType = (props: {
  motionType: MotionType | EvmUnrecognized;
  isPending?: boolean;
}) => {
  const { motionType, isPending } = props;
  const { chainId } = useLidoSDK();
  const easyTrack = useReadContract(EasyTrack);
  const registryContract = registryByMotionType[motionType];
  const registry = useReadContract(registryContract as ContractObject);

  return useQuery({
    queryKey: [`${motionType}-period-limits-data`, chainId, motionType],
    queryFn: async () => {
      if (motionType === EvmUnrecognized) {
        return null;
      }

      if (!isContractWithLimits(registry)) {
        return null;
      }

      return await getPeriodLimitsInfo(easyTrack, registry, isPending);
    },
    retry: 3,
  });
};
