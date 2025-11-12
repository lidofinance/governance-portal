import { useMemo } from 'react';

import {
  useRecipientMapAll,
  useAllowedRecipients,
  useTokenByTopUpType,
  type AllowedRecipient,
} from '../hooks/use-registry-with-limits';

import { formatEther } from 'ethers/lib/utils';

import { AddressPop } from 'shared/components/address-pop';

import {
  MotionDescriptionWithRegistryProps,
  DecodeCallData,
  RegistryType,
} from './types';
import { MotionTypeDisplayNames } from '../utils/get-motion-type-display-name';
import { addAllowedRecipientAbi } from 'abi/generated/AddAllowedRecipient';
import { topUpAllowedRecipientsAbi } from 'abi/generated/TopUpAllowedRecipients';
import { removeAllowedRecipientAbi } from 'abi/generated/RemoveAllowedRecipient';

export const AllowedRecipientAdd = ({
  callData,
  registryType,
}: MotionDescriptionWithRegistryProps<typeof addAllowedRecipientAbi>) => {
  const name = MotionTypeDisplayNames[registryType];

  return (
    <div>
      {name} <b>&#34;{callData[1]}&#34;</b> with address{' '}
      <AddressPop address={callData[0]} />
    </div>
  );
};

export const AllowedRecipientTopUp = ({
  callData,
  registryType,
}: MotionDescriptionWithRegistryProps<typeof topUpAllowedRecipientsAbi>) => {
  const token = useTokenByTopUpType({ registryType });
  const { data: allowedRecipientMap } = useRecipientMapAll({
    registryType,
  });

  const recipients = useMemo(() => {
    if (!allowedRecipientMap) return null;
    return callData[0].map((address) => allowedRecipientMap[address]);
  }, [callData, allowedRecipientMap]);

  const name = MotionTypeDisplayNames[registryType];

  return (
    <div>
      {name}:
      {callData[0].map((address, i) => (
        <div key={i}>
          <b>{recipients?.[i]}</b> <AddressPop address={address} /> with{' '}
          {Number(formatEther(callData[1][i])).toLocaleString('en-EN')}{' '}
          {token.label}
        </div>
      ))}
    </div>
  );
};

export const AllowedRecipientRemove = ({
  callData,
  registryType,
}: {
  callData: DecodeCallData<typeof removeAllowedRecipientAbi>;
  registryType: RegistryType;
}) => {
  const { data: allowedRecipients } = useAllowedRecipients({
    registryType,
  });

  const program = useMemo(() => {
    if (!allowedRecipients) return null;
    return allowedRecipients.find(
      (p: AllowedRecipient) => p.address === callData,
    );
  }, [callData, allowedRecipients]);

  const name = MotionTypeDisplayNames[registryType];

  return (
    <div>
      {name} <b>{program?.title}</b> with address{' '}
      <AddressPop address={callData} />
    </div>
  );
};
