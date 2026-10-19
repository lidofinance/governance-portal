import { useRecipientMapAll } from '../../hooks/use-registry-with-limits';

import { formatUnits, isAddress } from 'viem';
import { topUpWithLimitsStablesAbi } from 'abi/generated/TopUpWithLimitsStables';
import { MotionDescriptionProps } from '../types';
import { useMotionTokenData } from '../../hooks/use-motion-token-data';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { MotionInfoBox } from '@easy-track/start-motion/parts/style';

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
      {!tokenData && (
        <MotionInfoBox $variant="warning">
          Failed to read token metadata, amounts are shown in base units
        </MotionInfoBox>
      )}
      Top up single allowed recipient:
      {recipients.map((address, i) => {
        const recipientName = allowedRecipientMap[address];
        const formattedAmount = tokenData
          ? Number(formatUnits(amounts[i], tokenData.decimals)).toLocaleString(
              'en-EN',
            )
          : `${amounts[i].toString()} base units of`;

        const shouldShowName =
          !isAddress(recipientName) ||
          recipientName.toLowerCase() !== address.toLowerCase();

        return (
          <div key={i}>
            {shouldShowName ? <b>{recipientName} </b> : null}
            <AddressPopInline address={address} /> with {formattedAmount}{' '}
            {tokenData ? (
              <b>{tokenData.label}</b>
            ) : (
              <AddressPopInline address={token} />
            )}
          </div>
        );
      })}
    </div>
  );
};
