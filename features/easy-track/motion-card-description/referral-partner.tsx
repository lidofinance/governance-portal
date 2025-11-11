import { useMemo } from 'react';
import {
  useReferralPartnersAll,
  useReferralPartnersMapAll,
} from '../hooks/use-referral-partners';

import { NestProps } from './types';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { formatBalance } from 'utils/format-balance';
import { AddressPop } from 'shared/components/address-pop';

export const DescReferralPartnerAdd = ({
  callData,
}: NestProps<EvmAddReferralPartnerAbi['decodeEVMScriptCallData']>) => {
  return (
    <div>
      Add LDO referral partner <b>"{callData[1]}"</b> with address{' '}
      <AddressPop address={callData[0]} />
    </div>
  );
};

export const DescReferralPartnerTopUp = ({
  callData,
}: NestProps<EvmTopUpReferralPartnersAbi['decodeEVMScriptCallData']>) => {
  const { data: governanceToken } = useGovernanceToken();
  const { data: referralPartnersMap } = useReferralPartnersMapAll();

  const programs = useMemo(() => {
    if (!referralPartnersMap) return null;
    return callData[0].map((address) => referralPartnersMap[address]);
  }, [callData, referralPartnersMap]);

  return (
    <div>
      Top up LDO referral partner:
      {callData[0].map((address, i) => (
        <div key={i}>
          <b>{programs?.[i]}</b> <AddressPop address={address} /> with{' '}
          {formatBalance(callData[1][i])} {governanceToken?.symbol}
        </div>
      ))}
    </div>
  );
};

export const DescReferralPartnerRemove = ({
  callData,
}: NestProps<EvmRemoveReferralPartnerAbi['decodeEVMScriptCallData']>) => {
  const { data: referralPartners } = useReferralPartnersAll();

  const partner = useMemo(() => {
    if (!referralPartners) return null;
    return referralPartners.find((p) => p.address === callData);
  }, [callData, referralPartners]);

  return (
    <div>
      Remove LDO referral partner <b>{partner?.title}</b> with address{' '}
      <AddressInlineWithPop address={callData} />
    </div>
  );
};
