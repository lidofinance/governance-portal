import { constants, utils } from 'ethers';
import { processInBatches } from 'utils/process-in-batches';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { erc20Abi } from 'abi/generated';
import { useLidoSDK } from 'providers/lido-sdk';
import {
  AragonAcl,
  AragonFinance,
  EVMScriptExecutor,
} from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { toHex } from 'viem';

// Data structure reference
// https://github.com/lidofinance/scripts/blob/bda3568d1291bdc7ba422fb20150313f2d1778c3/scripts/vote_2024_01_16.py#L106
const TOKEN_ARG_INDEX = 0;
const AMOUNT_ARG_INDEX = 2;
const DEFAULT_DECIMALS = 18;
const MAX_PROVIDER_BATCH = 20;

const decodeLimit = (val: bigint, decimals: number | null) => {
  if (decimals === null) {
    return null;
  }

  return parseFloat(utils.formatUnits(val, decimals));
};

type LimitsMap = Record<string, number | null | undefined>;

export const useTransitionLimits = () => {
  const { chainId } = useLidoSDK();
  const connectErc20Contract = useReadContractGetter(erc20Abi);
  const finance = useReadContract(AragonFinance);
  const aragonAcl = useReadContract(AragonAcl);
  const EVMScriptExecutorContract = useReadContract(EVMScriptExecutor);

  return useQuery({
    queryKey: [`permission-param-${chainId}`],
    queryFn: async () => {
      const evmScriptExecutorAddress = EVMScriptExecutorContract.address;

      if (!evmScriptExecutorAddress) {
        const error = `EVMScriptExecutor address not found for chainId ${chainId}`;
        console.error(error);
        throw new Error(error);
      }

      const role = await finance.readContract('CREATE_PAYMENTS_ROLE');

      const paramsLength = await aragonAcl.readContract(
        'getPermissionParamsLength',
        [evmScriptExecutorAddress, finance.address, role],
      );

      const indexes = Array.from({ length: Number(paramsLength) }, (_, i) => i);

      const batchResults = await processInBatches(
        indexes,
        MAX_PROVIDER_BATCH,
        async (i) =>
          aragonAcl.readContract('getPermissionParam', [
            evmScriptExecutorAddress,
            finance.address,
            role,
            BigInt(i),
          ]),
      );

      // Build the params map directly from fulfilled results
      const params: Record<number, any> = {};
      const paramsArr: [number, number, bigint][] = [];

      batchResults.forEach((res, i) => {
        if (res.status === 'fulfilled') {
          params[indexes[i]] = res.value;
          paramsArr.push([...res.value]);
        } else {
          console.error(
            `Failed to fetch permission param at index ${indexes[i]}`,
            res.reason,
          );
        }
      });

      const limits: LimitsMap = {};

      let decimals: number | null = null;
      for (let i = 0; i < paramsArr.length; i += 1) {
        const [argIndex, , value] = paramsArr[i];

        if (argIndex === TOKEN_ARG_INDEX) {
          const tokenAddress = toHex(value);

          const limitParam = paramsArr[i + 1];

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (!limitParam || limitParam[0] !== AMOUNT_ARG_INDEX) {
            console.warn(
              `Expected limit param at index ${
                i + 1
              } for token ${tokenAddress}, but not found.`,
            );
            continue;
          }
          const limitValue = limitParam[2];
          if (tokenAddress === constants.AddressZero) {
            decimals = DEFAULT_DECIMALS;
          } else {
            const tokenContract = connectErc20Contract(tokenAddress);
            try {
              decimals = await tokenContract('decimals');
            } catch {
              decimals = null;
            }
          }

          limits[utils.getAddress(tokenAddress)] = decodeLimit(
            limitValue,
            decimals,
          );
          i += 1; // Skip the next param as it's already processed
        }
      }

      return limits;
    },
  });
};
