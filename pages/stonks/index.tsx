import { StonksList } from '@stonks/list';
import { StonksFindOrderForm } from '@stonks/find-order-form';
import { Layout } from 'shared/components';
import { useState } from 'react';
import { StonksTabsWrapper } from '@stonks/styles';
import { ToggleButton } from 'shared/components/toggle-button';

export default function StonksIndexPage() {
  const [mode, setMode] = useState('create');

  return (
    <Layout title="Stonks" subtitle="Treasury swaps" containerSize="tight">
      <StonksTabsWrapper>
        <ToggleButton
          onChange={setMode}
          value={mode}
          items={[
            { label: 'Create Order', value: 'create' },
            { label: 'Find Order', value: 'find' },
          ]}
        />
      </StonksTabsWrapper>
      {mode === 'create' ? <StonksList /> : <StonksFindOrderForm />}
    </Layout>
  );
}
