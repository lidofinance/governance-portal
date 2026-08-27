import { GetStaticPaths } from 'next';
import { STONKS_MAP } from '@stonks/addresses';
import { StonksPlaceOrderForm } from '@stonks/place-order-form';
import { ErrorBox } from '@stonks/styles';
import { useRouter } from 'next/router';
import { useLidoSDK } from 'providers/lido-sdk';
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

export default function StonksDetailsPage() {
  const { isReady } = useRouter();
  const { chainId } = useLidoSDK();
  const [stonksAddress] = useParsedQuery('stonksAddress');

  const stonksMetadata = STONKS_MAP[chainId]?.find(
    (s) => s.address.toLowerCase() === stonksAddress?.toLowerCase(),
  );

  // isReady-gated: the SSG server render sees route params while the client's
  // first render does not — unguarded param-derived output hydration-mismatches
  const pairLabel =
    isReady && stonksMetadata
      ? `${stonksMetadata.tokenFrom.symbol} -> ${stonksMetadata.tokenTo.symbol} `
      : '';

  return (
    <Layout
      title={pairLabel}
      subtitle="Place Stonks order"
      containerSize="tight"
    >
      {!isReady ? null : stonksMetadata ? (
        <StonksPlaceOrderForm stonksMetadata={stonksMetadata} />
      ) : (
        <ErrorBox>
          <Text>Invalid address</Text>
        </ErrorBox>
      )}
    </Layout>
  );
}
