import { EasyTrack } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
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

type UsePeriodLimitsInfoResultData = {
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
