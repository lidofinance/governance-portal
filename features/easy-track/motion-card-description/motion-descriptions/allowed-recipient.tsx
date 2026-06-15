import { useMemo } from 'react';

import {
  useRecipientMapAll,
  useAllowedRecipients,
  useTokenByTopUpType,
  type AllowedRecipient,
} from '../../hooks/use-registry-with-limits';

import { formatEther } from 'viem';

import { MotionDescriptionProps } from '../types';
import { MotionTypeDisplayNames } from '../../utils/get-motion-type-display-name';
import { addAllowedRecipientAbi } from 'abi/generated/AddAllowedRecipient';
import { topUpAllowedRecipientsAbi } from 'abi/generated/TopUpAllowedRecipients';
import { removeAllowedRecipientAbi } from 'abi/generated/RemoveAllowedRecipient';
import { AddressPopInline } from 'shared/components/address-pop-inline';

export const AllowedRecipientAdd = ({
  callData,
  motionType,
}: MotionDescriptionProps<typeof addAllowedRecipientAbi>) => {
  const name = MotionTypeDisplayNames[motionType];

  return (
    <div>
      {name} <b>&#34;{callData[1]}&#34;</b> with address{' '}
      <AddressPopInline address={callData[0]} />
    </div>
  );
};

export const AllowedRecipientTopUp = ({
  callData,
  motionType,
}: MotionDescriptionProps<typeof topUpAllowedRecipientsAbi>) => {
  const token = useTokenByTopUpType({ registryType: motionType });
  const { data: allowedRecipientMap } = useRecipientMapAll({
    registryType: motionType,
  });

  const recipients = useMemo(() => {
    if (!allowedRecipientMap) return null;
    return callData[0].map((address) => allowedRecipientMap[address]);
  }, [callData, allowedRecipientMap]);

  const name = MotionTypeDisplayNames[motionType];

  return (
    <div>
      {name}:
      {callData[0].map((address, i) => (
        <div key={i}>
          <b>{recipients?.[i]}</b> <AddressPopInline address={address} /> with{' '}
          {Number(formatEther(callData[1][i])).toLocaleString('en-EN')}{' '}
          {token.label}
        </div>
      ))}
    </div>
  );
};

export const AllowedRecipientRemove = ({
  callData,
  motionType,
}: MotionDescriptionProps<typeof removeAllowedRecipientAbi>) => {
  const { data: allowedRecipients } = useAllowedRecipients({
    registryType: motionType,
  });

  const program = useMemo(() => {
    if (!allowedRecipients) return null;
    return allowedRecipients.find(
      (p: AllowedRecipient) => p.address === callData,
    );
  }, [callData, allowedRecipients]);

  const name = MotionTypeDisplayNames[motionType];

  return (
    <div>
      {name} <b>{program?.title}</b> with address{' '}
      <AddressPopInline address={callData} />
    </div>
  );
};
