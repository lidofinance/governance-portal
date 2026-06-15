import { useRecipientMapAll } from '../../hooks/use-registry-with-limits';

import { formatUnits, isAddress } from 'viem';
import { topUpWithLimitsStablesAbi } from 'abi/generated/TopUpWithLimitsStables';
import { MotionDescriptionProps } from '../types';
import { useMotionTokenData } from '../../hooks/use-motion-token-data';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { ETH_DECIMALS } from 'shared/blockchain/constants';

export const TopUpWithLimitsAndCustomToken = ({
  callData,
  motionType,
}: MotionDescriptionProps<typeof topUpWithLimitsStablesAbi>) => {
  const [token, recipients, amounts] = callData;

  const { data: allowedRecipientMap, isPending: isRecipientDataLoading } =
    useRecipientMapAll({ registryType: motionType });

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
          formatUnits(amounts[i], tokenData?.decimals ?? ETH_DECIMALS),
        ).toLocaleString('en-EN');

        const shouldShowName =
          !isAddress(recipientName) ||
          recipientName.toLowerCase() !== address.toLowerCase();

        return (
          <div key={i}>
            {shouldShowName ? <b>{recipientName} </b> : null}
            <AddressPopInline address={address} /> with {formattedAmount}{' '}
            {tokenData ? <b>{tokenData.label}</b> : null}
          </div>
        );
      })}
    </div>
  );
};
