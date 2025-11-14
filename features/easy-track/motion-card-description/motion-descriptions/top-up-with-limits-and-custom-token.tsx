import {
  useRecipientMapAll,
  REGISTRY_WITH_LIMITS_BY_MOTION_TYPE,
} from '../../hooks/use-registry-with-limits';

import { AddressPop } from 'shared/components/address-pop';

import { formatUnits, isAddress } from 'ethers/lib/utils';
import { topUpWithLimitsStablesAbi } from 'abi/generated/TopUpWithLimitsStables';
import { MotionDescriptionProps } from '../types';
import { useMotionTokenData } from '../../hooks/use-motion-token-data';

type Props = MotionDescriptionProps<typeof topUpWithLimitsStablesAbi> & {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE;
};

export const TopUpWithLimitsAndCustomToken = ({
  callData,
  registryType,
}: Props) => {
  const [token, recipients, amounts] = callData;

  const { data: allowedRecipientMap, isPending: isRecipientDataLoading } =
    useRecipientMapAll({ registryType });

  const { data: tokenData, isLoading: isTokenDataLoading } =
    useMotionTokenData(token);

  if (isRecipientDataLoading || !allowedRecipientMap || isTokenDataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Top up single allowed recipient:
      {recipients.map((address, i) => {
        const recipientName = allowedRecipientMap[address];
        const formattedAmount = Number(
          formatUnits(amounts[i], tokenData?.decimals),
        ).toLocaleString('en-EN');

        const shouldShowName =
          !isAddress(recipientName) ||
          recipientName.toLowerCase() !== address.toLowerCase();

        return (
          <div key={i}>
            {shouldShowName ? <b>{recipientName} </b> : null}
            <AddressPop address={address} /> with {formattedAmount}{' '}
            {tokenData ? <b>{tokenData.label}</b> : null}
          </div>
        );
      })}
    </div>
  );
};
