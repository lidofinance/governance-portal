import { StonksList } from '@stonks/list';
import { StonksOrderResolverForm } from '@stonks/order-resolver-form';
import { Layout } from 'shared/components';
import { Tab, Tabs } from 'shared/components/tabs';
import { useState } from 'react';
import { StonksTabContent, StonksTabText } from '@stonks/styles';

export default function StonksIndexPage() {
  const [mode, setMode] = useState<'create' | 'manage'>('create');

  return (
    <Layout
      pageTitle="Stonks"
      title="Stonks"
      subtitle="Treasury swaps"
      containerSize="tight"
    >
      <Tabs>
        <Tab isActive={mode === 'create'} onClick={() => setMode('create')}>
          <StonksTabText>Create order</StonksTabText>
        </Tab>
        <Tab isActive={mode === 'manage'} onClick={() => setMode('manage')}>
          <StonksTabText>Manage order</StonksTabText>
        </Tab>
      </Tabs>
      <StonksTabContent>
        {mode === 'create' && <StonksList />}
        {mode === 'manage' && <StonksOrderResolverForm />}
      </StonksTabContent>
    </Layout>
  );
}
