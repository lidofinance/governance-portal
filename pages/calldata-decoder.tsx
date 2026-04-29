import { CalldataDecoderForm } from 'features/calldata-decoder/components/calldata-decoder-form';
import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utils-api/get-default-static-props';

export const getStaticProps = getDefaultStaticProps();

export default function CalldataDecoderPage() {
  return (
    <Layout
      title="Calldata decoder"
      subtitle="Note: no Etherscan. Local ABIs only"
      containerSize="tight"
    >
      <CalldataDecoderForm />
    </Layout>
  );
}
