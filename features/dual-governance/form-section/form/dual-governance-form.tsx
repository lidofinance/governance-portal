import { useState } from 'react';
import { ToggleButton } from 'shared/components/toggle-button';
import { SupportForm } from './forms/support-form/support-form';
import { RevokeForm } from './forms/revoke-form/revoke-form';

import { FormTitle, FormWrapper, FormHeader } from './style';

export const DualGovernanceForm = () => {
  const [activeTab, setActiveTab] = useState('support');

  return (
    <FormWrapper>
      <FormHeader>
        <FormTitle>Dual Governance</FormTitle>
        <ToggleButton
          onChange={setActiveTab}
          items={[
            { label: 'Support Veto', value: 'support' },
            { label: 'Manage Tokens', value: 'manage' },
          ]}
        />
      </FormHeader>
      {activeTab === 'support' && <SupportForm />}
      {activeTab === 'manage' && <RevokeForm />}
    </FormWrapper>
  );
};
