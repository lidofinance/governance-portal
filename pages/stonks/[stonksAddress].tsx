import { STONKS_MAP } from '@stonks/addresses';
import { StonksPlaceOrderForm } from '@stonks/place-order-form';
import { ErrorBox } from '@stonks/styles';
import { useRouter } from 'next/router';
import { useLidoSDK } from 'providers/lido-sdk';
import { Layout } from 'shared/components';
import { Text } from 'shared/components/text';
import { useParsedQuery } from 'shared/hooks/use-parsed-query';

export default function StonksDetailsPage() {
  const { isReady } = useRouter();
  const { chainId } = useLidoSDK();
  const [stonksAddress] = useParsedQuery('stonksAddress');

  const stonksMetadata = STONKS_MAP[chainId]?.find(
    (s) => s.address.toLowerCase() === stonksAddress?.toLowerCase(),
  );

  const pairLabel = stonksMetadata
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
