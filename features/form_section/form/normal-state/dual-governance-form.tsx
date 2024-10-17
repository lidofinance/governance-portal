import { useCallback, useState } from 'react';
import { ToggleButton } from 'shared/components/toggle-button';
import { SupportForm } from './support-form/support-form';
import { RevokeForm } from './revoke-form/revoke-form';

import { FormTitle, FormWrapper, FormHeader } from '../style';

type ActiveTab = 'support' | 'revoke';

export const DualGovernanceForm = () => {
  const [activeTab, setActiveTab] = useState('support')<ActiveTab>;

  const handleToggleChange = useCallback(
    (val: ActiveTab) => {
      setActiveTab(val);
    },
    [setActiveTab],
  );

  return (
    <FormWrapper>
      <FormHeader>
        <FormTitle>Dual Governance</FormTitle>
        <ToggleButton
          onChange={handleToggleChange}
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
