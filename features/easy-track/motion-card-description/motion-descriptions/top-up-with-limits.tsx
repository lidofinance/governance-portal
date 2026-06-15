import { useMemo } from 'react';
import {
  useRecipientMapAll,
  useTokenByTopUpType,
} from '../../hooks/use-registry-with-limits';

import { formatEther, isAddress } from 'viem';
import { topUpWithLimitsAbi } from 'abi/generated/TopUpWithLimits';
import { MotionDescriptionProps } from '../types';
import { AddressPopInline } from 'shared/components/address-pop-inline';

export const TopUpWithLimits = ({
  callData,
  motionType,
}: MotionDescriptionProps<typeof topUpWithLimitsAbi>) => {
  const { data: allowedRecipientMap } = useRecipientMapAll({
    registryType: motionType,
  });
  const token = useTokenByTopUpType({ registryType: motionType });

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
            <AddressPopInline address={address} /> with{' '}
            {Number(formatEther(callData[1][i])).toLocaleString('en-EN')}{' '}
            {token.label}
          </div>
        );
      })}
    </div>
  );
};
