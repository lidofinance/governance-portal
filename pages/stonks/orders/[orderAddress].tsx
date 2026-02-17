import { Loader } from '@lidofinance/lido-ui';
import { useCowOrderData } from '@stonks/hooks/use-cow-order-data';
import { useStonksOrderData } from '@stonks/hooks/use-stonks-order-data';
import { StonksOrderCard } from '@stonks/order-card';
import { ErrorBox } from '@stonks/styles';
import { useRouter } from 'next/router';
import { Layout } from 'shared/components';
import { Text } from 'shared/components/text';

export default function StonksOrderPage() {
  const router = useRouter();
  const orderAddress = String(router.query.orderAddress);

  const {
    data: orderData,
    isLoading: isStonksDataLoading,
    error,
  } = useStonksOrderData(orderAddress);

  const { data: cowOrderData, isLoading: isCowDataLoading } =
    useCowOrderData(orderData);

  const isLoading = isStonksDataLoading || isCowDataLoading;

  return (
    <Layout
      pageTitle="Stonks Order "
      title="Stonks Order"
      subtitle={
        orderData
          ? `${orderData.stonksMetadata.tokenFrom.symbol} → ${orderData.stonksMetadata.tokenTo.symbol}`
          : null
      }
      containerSize="tight"
    >
      {error ? (
        <ErrorBox>
          <Text>{error.message ?? 'Unknown error'}</Text>
        </ErrorBox>
      ) : null}
      {orderData ? (
        <StonksOrderCard
          order={orderData}
          cowOrderData={cowOrderData}
          isLoading={isLoading}
        />
      ) : isLoading && !error ? (
        <Loader />
      ) : null}
    </Layout>
  );
}
