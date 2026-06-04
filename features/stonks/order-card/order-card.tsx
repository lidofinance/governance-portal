import { trimAddress } from '@lidofinance/lido-ui';

import { StonksOrderCardCreateButton } from './order-create-button';
import { StonksOrderCardRecoverButton } from './order-recover-button';
import {
  OrderCardWrapper,
  Row,
  ButtonsRow,
  Label,
  LinkValue,
  Value,
  NumberValue,
  StatusValue,
} from './style';
import { CowOrder, OrderData, OrderStatus } from '@stonks/types';
import { useLidoSDK } from 'providers/lido-sdk';
import { getCowOrderUrl } from '@stonks/utils/get-cow-order-url';
import { FormattedDate } from 'shared/components/formatted-date';
import { getEtherscanLink } from 'utils/etherscan';
import { formatToken } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';
import { AddressPop } from 'shared/components/address-pop';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getOrderStatusText } from '@stonks/utils/get-order-status-text';
import { useMemo } from 'react';

type Props = {
  order: OrderData;
  cowOrderData: CowOrder | null | undefined;
  isLoading?: boolean;
  onInvalidate?: () => Promise<void>;
};

export const StonksOrderCard = ({
  order,
  cowOrderData,
  isLoading,
  onInvalidate,
}: Props) => {
  const { chainId } = useLidoSDK();
  const orderLink = getCowOrderUrl(cowOrderData?.uid, chainId);

  const tokenFrom = order.stonksMetadata.tokenFrom;
  const tokenTo = order.stonksMetadata.tokenTo;

  const sellAmountString = formatToken({
    amount: order.sellAmount,
    decimals: tokenFrom.decimals,
    symbol: tokenFrom.symbol,
  });
  const buyAmountString = formatToken({
    amount: order.buyAmount,
    decimals: tokenTo.decimals,
    symbol: tokenTo.symbol,
  });

  const canCreateOffChainOrder =
    !order.isExpired && order.hasBalance && !cowOrderData?.uid;

  const orderStatus: OrderStatus = useMemo(() => {
    if (cowOrderData) {
      return cowOrderData.status;
    }
    // expired and has non zero balance
    if (order.isRecoverable) {
      return 'expired';
    }

    // expired and has zero balance, hence was recovered
    if (order.isExpired) {
      return 'cancelled';
    }

    return 'not-created';
  }, [cowOrderData, order.isExpired, order.isRecoverable]);

  return (
    <OrderCardWrapper>
      <Row>
        <Label>Status</Label>
        <StatusValue value={orderStatus}>
          {getOrderStatusText(orderStatus)}
        </StatusValue>
      </Row>
      <Row>
        <Label>Order address</Label>
        <AddressPop address={order.address}>
          <LinkValue>{trimAddress(order.address, 4)}</LinkValue>
        </AddressPop>
      </Row>
      {cowOrderData?.uid ? (
        <Row>
          <Label>CoW order uid</Label>
          {orderLink ? (
            <Link href={orderLink} target="_blank" rel="noreferrer">
              <LinkValue>{trimAddress(cowOrderData.uid, 6)}</LinkValue>
            </Link>
          ) : (
            <Text>{trimAddress(cowOrderData.uid, 6)}</Text>
          )}
        </Row>
      ) : null}
      <Row>
        <Label>Factory address</Label>
        <AddressPop address={order.stonksMetadata.address}>
          <LinkValue>{trimAddress(order.stonksMetadata.address, 4)}</LinkValue>
        </AddressPop>
      </Row>
      {cowOrderData?.creationDate ? (
        <Row>
          <Label>Created at</Label>
          <Value>
            <FormattedDate
              date={dayjs(cowOrderData.creationDate).unix()}
              format="MMM DD, YYYY hh:mma"
            />
          </Value>
        </Row>
      ) : null}
      <Row>
        <Label>Valid until</Label>
        <Value>
          <FormattedDate date={order.validTo} format="MMM DD, YYYY hh:mma" />
        </Value>
      </Row>
      <Row>
        <Label>Sell amount (executed/initial)</Label>
        <NumberValue>
          {cowOrderData
            ? `${formatToken({ amount: cowOrderData.executedSellAmount, decimals: tokenFrom.decimals })}/${sellAmountString} (${cowOrderData.sellAmountFulfillmentPct}%)`
            : sellAmountString}
        </NumberValue>
      </Row>
      <Row>
        <Label>Buy amount (executed/initial)</Label>
        <NumberValue>
          {cowOrderData
            ? `${formatToken({ amount: cowOrderData.executedBuyAmount, decimals: tokenTo.decimals })}/${buyAmountString} (${cowOrderData.buyAmountFulfillmentPct}%)`
            : buyAmountString}
        </NumberValue>
      </Row>

      {cowOrderData?.transactions?.length ? (
        <>
          {cowOrderData.transactions.length > 1 ? (
            <>
              <Row>
                <Label>Swap txs:</Label>
              </Row>
              {cowOrderData.transactions.map((tx) => (
                <Link
                  key={tx.txHash}
                  href={getEtherscanLink(chainId, tx.txHash, 'tx')}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkValue> {trimAddress(tx.txHash, 12)}</LinkValue>
                </Link>
              ))}
            </>
          ) : (
            <Row>
              <Label>Swap tx</Label>
              <Link
                href={getEtherscanLink(
                  chainId,
                  cowOrderData.transactions[0].txHash,
                  'tx',
                )}
                target="_blank"
                rel="noreferrer"
              >
                <LinkValue>
                  {trimAddress(cowOrderData.transactions[0].txHash, 6)}
                </LinkValue>
              </Link>
            </Row>
          )}
        </>
      ) : null}
      {order.isRecoverable && (
        <Row>
          <Label>Recoverable amount</Label>
          <NumberValue>
            {formatToken({
              amount: order.recoverableAmount,
              decimals: order.stonksMetadata.tokenFrom.decimals,
              symbol: tokenFrom.symbol,
            })}
          </NumberValue>
        </Row>
      )}

      {canCreateOffChainOrder || order.isRecoverable ? (
        <ButtonsRow>
          {canCreateOffChainOrder && (
            <StonksOrderCardCreateButton
              order={order}
              isLoading={isLoading}
              onSuccess={onInvalidate}
            />
          )}
          {order.isRecoverable && (
            <StonksOrderCardRecoverButton
              orderAddress={order.address}
              onFinish={onInvalidate}
            />
          )}
        </ButtonsRow>
      ) : null}
    </OrderCardWrapper>
  );
};
