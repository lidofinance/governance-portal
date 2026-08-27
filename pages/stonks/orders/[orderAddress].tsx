import { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { Loader } from '@lidofinance/lido-ui';
import { useCowOrderData } from '@stonks/hooks/use-cow-order-data';
import { useStonksOrderData } from '@stonks/hooks/use-stonks-order-data';
import { StonksOrderCard } from '@stonks/order-card';
import { ErrorBox } from '@stonks/styles';
import { Layout } from 'shared/components';
import { Text } from 'shared/components/text';
import { useParsedQuery } from 'shared/hooks/use-parsed-query';
import { getDefaultStaticProps } from 'utils-api/get-default-static-props';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = getDefaultStaticProps();

export default function StonksOrderPage() {
  const { isReady } = useRouter();
  const [orderAddress] = useParsedQuery('orderAddress');

  const {
    data: orderData,
    isLoading: isStonksDataLoading,
    error,
    refetch,
  } = useStonksOrderData(orderAddress);

  const {
    data: cowOrderData,
    isLoading: isCowDataLoading,
    refetch: cowRefetch,
  } = useCowOrderData(orderData);

  const isLoading = isStonksDataLoading || isCowDataLoading;

  const handleInvalidate = async () => {
    await Promise.all([refetch(), cowRefetch()]);
  };

  return (
    <Layout
      title="Stonks Order"
      subtitle={
        orderData
          ? `${orderData.stonksMetadata.tokenFrom.symbol} → ${orderData.stonksMetadata.tokenTo.symbol}`
          : null
      }
      containerSize="tight"
    >
      {/* isReady-gated: the SSG server render sees route params while the
          client's first render does not — the query fires server-side and
          renders a Loader the client's first render would not */}
      {!isReady ? null : (
        <>
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
              onInvalidate={handleInvalidate}
            />
          ) : isLoading && !error ? (
            <Loader />
          ) : null}
        </>
      )}
    </Layout>
  );
}
