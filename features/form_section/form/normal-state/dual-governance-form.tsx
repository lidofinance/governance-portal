import { useState } from 'react';
import { ToggleButton } from 'shared/components/toggle-button';
import { SupportForm } from './support-form/support-form';
import { RevokeForm } from './revoke-form/revoke-form';

import { FormTitle, FormWrapper, FormHeader } from '../style';

export const DualGovernanceForm = () => {
  const [activeTab, setActiveTab] = useState('support');

  return (
    <FormWrapper>
      <FormHeader>
        <FormTitle>Dual Governance</FormTitle>
        <ToggleButton
          onChange={setActiveTab}
          items={[
            { label: 'Support', value: 'support' },
            { label: 'My tokens in DG', value: 'revoke' },
          ]}
        />
      </FormHeader>
      {activeTab === 'support' && <SupportForm />}
      {activeTab === 'revoke' && <RevokeForm />}
    </FormWrapper>
  );
};
