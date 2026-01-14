import { useMemo } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { ReferralPartnersRegistry } from 'shared/blockchain/contracts';
import { Address } from 'viem';

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

export const useReferralPartnersActual = () => {
  const { chainId } = useLidoSDK();
  const partnersAll = useReferralPartnersAll();
  const referalPartnersRegistry = useReadContract(ReferralPartnersRegistry);

  return useQuery({
    queryKey: [
      'referral-partners-actual',
      referalPartnersRegistry?.address,
      chainId,
    ],
    queryFn: async () => {
      if (!referalPartnersRegistry) return [];
      const addresses =
        await referalPartnersRegistry.readContract('getRewardPrograms');
      if (partnersAll.data) {
        return partnersAll.data.filter(
          (p) => addresses.indexOf(p.address as Address) !== -1,
        );
      }
      return addresses.map((address) => ({ title: address, address }));
    },
    enabled: !!referalPartnersRegistry,
  });
};

export const useReferralPartnersMapAll = () => {
  const partners = useReferralPartnersAll();
  return useReferralPartnersMap(partners);
};

export const useReferralPartnersMapActual = () => {
  const partners = useReferralPartnersActual();
  return useReferralPartnersMap(partners);
};
