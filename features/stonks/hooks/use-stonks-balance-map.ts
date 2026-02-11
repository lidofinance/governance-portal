import { STONKS_MAP } from '@stonks/addresses';
import { useQuery } from '@tanstack/react-query';
import { erc20Abi, stonksV1Abi } from 'abi/generated';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';

const MIN_BALANCE_WEI = 10n;

export const useStonksBalanceMap = () => {
  const { chainId } = useLidoSDK();

  const getStonksContract = useReadContractGetter(stonksV1Abi);
  const getErc20Contract = useReadContractGetter(erc20Abi);

  return useQuery({
    queryKey: ['stonks-data', chainId],
    queryFn: async () => {
      const stonksMetadata = STONKS_MAP[chainId];
      if (!stonksMetadata) {
        return null;
      }

      const data = await Promise.all(
        stonksMetadata.map(async (stonks) => {
          const stonksContractReader = getStonksContract(stonks.address);
          let tokenFromAddress = stonks.tokenFrom.addresses[chainId];

          if (!tokenFromAddress) {
            tokenFromAddress = await stonksContractReader('TOKEN_FROM');
            console.warn(
              `Token from address for stonks ${stonks.address} on chain ${chainId} is not defined in the map, using on-chain value: ${tokenFromAddress}`,
            );
          }

          const tokenFromContractReader = getErc20Contract(tokenFromAddress);

          let currentBalance = await tokenFromContractReader('balanceOf', [
            stonks.address,
          ]);

          if (currentBalance < MIN_BALANCE_WEI) {
            currentBalance = 0n;
          }

          return {
            address: stonks.address,
            currentBalance,
          };
        }),
      );

      return data.reduce(
        (acc, item) => {
          acc[item.address] = item.currentBalance;
          return acc;
        },
        {} as Record<string, bigint | undefined>,
      );
    },
  });
};
