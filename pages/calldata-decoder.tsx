import { CalldataDecoderForm } from 'features/calldata-decoder/components/calldata-decoder-form';
import { Layout } from 'shared/components';

export default function CalldataDecoderPage() {
  return (
    <Layout title="Calldata decoder" containerSize="tight">
      <CalldataDecoderForm />
    </Layout>
  );
}
