import { useMemo } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { ReferralPartnersRegistry } from 'shared/blockchain/contracts';

type ReferralPartner = {
  title: string;
  address: string;
};

const useReferralPartnersMap = (
  partners: UseQueryResult<ReferralPartner[] | null>,
) => {
  const result = useMemo(() => {
    if (!partners.data) return null;
    return partners.data.reduce(
      (res, p) => ({ [p.address]: p.title, ...res }),
      {} as Record<string, string>,
    );
  }, [partners.data]);
  return {
    ...partners,
    data: result,
  };
};

export const useReferralPartnersAll = () => {
  const { chainId } = useLidoSDK();
  const referralPartnersRegistry = useReadContract(ReferralPartnersRegistry);

  return useQuery({
    queryKey: [
      'referral-partners-all',
      chainId,
      referralPartnersRegistry?.address,
    ],
    queryFn: async () => {
      if (!referralPartnersRegistry) return [];
      const programs =
        await referralPartnersRegistry.readContract('getRewardPrograms');
      return programs.map((address: string) => ({
        title: address,
        address,
      }));
    },
    enabled: !!referralPartnersRegistry,
    retry: true,
    retryDelay: 5000,
  });
};

export const useReferralPartnersMapAll = () => {
  const partners = useReferralPartnersAll();
  return useReferralPartnersMap(partners);
};
