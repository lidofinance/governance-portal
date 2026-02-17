import { trimAddress } from '@lidofinance/lido-ui';
import { usePlaceOrderFormData } from '@stonks/providers/place-order-form-context';
import { useLidoSDK } from 'providers/lido-sdk';
import { AddressPop } from 'shared/components/address-pop';
import { Text } from 'shared/components/text';
import { PlaceOrderFormInfoRow, PlaceOrderFormInfoWrapper } from './style';

export const PlaceOrderFormInfo = () => {
  const { chainId } = useLidoSDK();
  const { stonksMetadata } = usePlaceOrderFormData();

  const tokenFromAddress = stonksMetadata.tokenFrom.addresses[chainId];
  const tokenToAddress = stonksMetadata.tokenTo.addresses[chainId];

  return (
    <PlaceOrderFormInfoWrapper>
      <PlaceOrderFormInfoRow>
        <Text color="secondary">Factory address</Text>
        <AddressPop address={stonksMetadata.address}>
          <Text color="accent">{trimAddress(stonksMetadata.address, 4)}</Text>
        </AddressPop>
      </PlaceOrderFormInfoRow>
      <PlaceOrderFormInfoRow>
        <Text color="secondary">From</Text>
        {tokenFromAddress && (
          <AddressPop address={tokenFromAddress}>
            <Text color="accent">{stonksMetadata.tokenFrom.symbol}</Text>
          </AddressPop>
        )}
      </PlaceOrderFormInfoRow>
      <PlaceOrderFormInfoRow>
        <Text color="secondary">To</Text>
        {tokenToAddress && (
          <AddressPop address={tokenToAddress}>
            <Text color="accent">{stonksMetadata.tokenTo.symbol}</Text>
          </AddressPop>
        )}
      </PlaceOrderFormInfoRow>
      <PlaceOrderFormInfoRow>
        <Text color="secondary">Duration</Text>
        <Text>{stonksMetadata.orderDuration / 60} minutes</Text>
      </PlaceOrderFormInfoRow>
      <PlaceOrderFormInfoRow>
        <Text color="secondary">Margin</Text>
        <Text>{stonksMetadata.marginBp / 100}%</Text>
      </PlaceOrderFormInfoRow>
      <PlaceOrderFormInfoRow>
        <Text color="secondary">Price tolerance</Text>
        <Text>{stonksMetadata.priceToleranceBp / 100}%</Text>
      </PlaceOrderFormInfoRow>
    </PlaceOrderFormInfoWrapper>
  );
};
