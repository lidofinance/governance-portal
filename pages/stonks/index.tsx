import { StonksGridWrapper } from '@stonks/grid-wrapper';
import { StonksOrderResolverForm } from '@stonks/order-resolver-form';
import { Layout } from 'shared/components';
import { Text } from 'shared/components/text';

export default function StonksIndexPage() {
  return (
    <Layout containerSize="full">
      <Text size={24} strong>
        Stonks
      </Text>
      <Text size={20} strong>
        Manage existing order
      </Text>
      <StonksOrderResolverForm />
      <Text size={20} strong>
        Create on-chain order
      </Text>
      <StonksGridWrapper />
    </Layout>
  );
}
