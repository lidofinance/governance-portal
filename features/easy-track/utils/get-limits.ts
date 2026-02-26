import { formatRawBalance } from 'utils/format-balance';
import { DecodeFunctionResultReturnType } from 'viem';
import { limitCheckerAbi } from 'abi/generated/LimitChecker';

export type LimitsType = {
  limit: string;
  periodDurationMonths: number;
};

type GetLimitParameters = DecodeFunctionResultReturnType<
  typeof limitCheckerAbi,
  'getLimitParameters'
>;

export const getLimits = async <
  T extends {
    readContract: (functionName: string, ...args: any[]) => Promise<any>;
  },
>(
  contract: T,
): Promise<LimitsType> => {
  const [limit, periodDurationMonths] = (await contract.readContract(
    'getLimitParameters',
  )) as GetLimitParameters;

  return {
    limit: formatRawBalance(limit),
    periodDurationMonths: Number(periodDurationMonths),
  };
};
