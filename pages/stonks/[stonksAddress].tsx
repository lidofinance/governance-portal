import { STONKS_MAP } from '@stonks/addresses';
import { StonksPlaceOrderForm } from '@stonks/place-order-form';
import { ErrorBox } from '@stonks/styles';
import { useRouter } from 'next/router';
import { useLidoSDK } from 'providers/lido-sdk';
import { Layout } from 'shared/components';
import { Text } from 'shared/components/text';

export default function StonksDetailsPage() {
  const router = useRouter();
  const { chainId } = useLidoSDK();

  if (!router.query.stonksAddress) {
    return null;
  }

  const addressParam = String(router.query.stonksAddress);

  const stonksMetadata = STONKS_MAP[chainId]?.find(
    (s) => s.address.toLowerCase() === addressParam.toLowerCase(),
  );

  const pairLabel = stonksMetadata
    ? `${stonksMetadata.tokenFrom.symbol} -> ${stonksMetadata.tokenTo.symbol} `
    : '';

  return (
    <Layout
      pageTitle={`${pairLabel}Stonks`}
      title={pairLabel}
      subtitle="Place Stonks order"
      containerSize="tight"
    >
      {stonksMetadata ? (
        <StonksPlaceOrderForm stonksMetadata={stonksMetadata} />
      ) : (
        <ErrorBox>
          <Text>Invalid address</Text>
        </ErrorBox>
      )}
    </Layout>
  );
}
