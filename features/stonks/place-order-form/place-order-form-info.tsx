import { trimAddress } from '@lidofinance/lido-ui';
import { usePlaceOrderFormData } from '@stonks/providers/place-order-form-context';
import { formatToken } from 'shared/blockchain/utils';
import { useLidoSDK } from 'providers/lido-sdk';
import { AddressPop } from 'shared/components/address-pop';
import { Text } from 'shared/components/text';
import { PlaceOrderFormInfoRow, PlaceOrderFormInfoWrapper } from './style';

export const PlaceOrderFormInfo = () => {
  const { chainId } = useLidoSDK();
  const { stonksMetadata, balance, estimatedOutputFromBalance } =
    usePlaceOrderFormData();

  const tokenFromAddress = stonksMetadata.tokenFrom.addresses[chainId];
  const tokenToAddress = stonksMetadata.tokenTo.addresses[chainId];

  return (
    <>
      <PlaceOrderFormInfoWrapper>
        <Text color="secondary">NOTE</Text>
        {stonksMetadata.version === 1 && (
          <Text>
            This is a v1 Stonks instance. A placed order always transfers the
            entire balance.
          </Text>
        )}
        <Text>
          Minimum buy amount can be raised above the estimate. The order fills
          only at or above this value and may expire unfilled if the value is
          set too high.
        </Text>
      </PlaceOrderFormInfoWrapper>
      <PlaceOrderFormInfoWrapper>
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
          <Text color="secondary">Balance</Text>
          <Text>
            {balance !== undefined &&
              formatToken({
                amount: balance,
                decimals: stonksMetadata.tokenFrom.decimals,
                symbol: stonksMetadata.tokenFrom.symbol,
                maxFractionDigits: 4,
              })}
          </Text>
        </PlaceOrderFormInfoRow>
        <PlaceOrderFormInfoRow>
          <Text color="secondary">Estimated output from balance</Text>
          <Text>
            {estimatedOutputFromBalance !== undefined &&
              formatToken({
                amount: estimatedOutputFromBalance,
                decimals: stonksMetadata.tokenTo.decimals,
                symbol: stonksMetadata.tokenTo.symbol,
                maxFractionDigits: 4,
              })}
          </Text>
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
        <PlaceOrderFormInfoRow>
          <Text color="secondary">Factory address</Text>
          <AddressPop address={stonksMetadata.address}>
            <Text color="accent">{trimAddress(stonksMetadata.address, 4)}</Text>
          </AddressPop>
        </PlaceOrderFormInfoRow>
      </PlaceOrderFormInfoWrapper>
    </>
  );
};
