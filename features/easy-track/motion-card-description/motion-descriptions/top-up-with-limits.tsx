import { useMemo } from 'react';
import {
  useRecipientMapAll,
  REGISTRY_WITH_LIMITS_BY_MOTION_TYPE,
  useTokenByTopUpType,
} from '../../hooks/use-registry-with-limits';

import { AddressPop } from 'shared/components/address-pop';

import { formatEther, isAddress } from 'ethers/lib/utils';
import { topUpWithLimitsAbi } from 'abi/generated/TopUpWithLimits';
import { MotionDescriptionProps } from '../types';

export const TopUpWithLimits = ({
  callData,
  registryType,
}: MotionDescriptionProps<typeof topUpWithLimitsAbi> & {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE;
}) => {
  const { data: allowedRecipientMap } = useRecipientMapAll({ registryType });
  const token = useTokenByTopUpType({ registryType });

  const recipients = useMemo(() => {
    if (!allowedRecipientMap) return null;
    return callData[0].map((address) => allowedRecipientMap[address]);
  }, [callData, allowedRecipientMap]);

  return (
    <div>
      Top up single allowed recipient:
      {callData[0].map((address, i) => {
        const recipientName = recipients?.[i];

        const shouldShowName =
          recipientName &&
          (!isAddress(recipientName) ||
            recipientName.toLowerCase() !== address.toLowerCase());

        return (
          <div key={i}>
            {shouldShowName ? <b>{recipientName} </b> : null}
            <AddressPop address={address} /> with{' '}
            {Number(formatEther(callData[1][i])).toLocaleString('en-EN')}{' '}
            {token.label}
          </div>
        );
      })}
    </div>
  );
};
