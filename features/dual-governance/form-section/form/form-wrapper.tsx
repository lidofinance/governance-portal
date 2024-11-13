import { useConsentContext } from 'providers/dg-consent';
import { DualGovernanceExplainer } from './explainer';
import { DualGovernanceFormWrapperStyled, FormWrapperHeader } from './style';
import { Text } from 'shared/components/text';
import { ToggleButton } from 'shared/components/toggle-button';
import { useState } from 'react';
import { SupportForm } from './forms/support-form';
import { RevokeForm } from './forms/revoke-form';
import { useAccount } from 'wagmi';

export const DualGovernanceFormWrapper = () => {
  const { isConnected } = useAccount();
  const { isConsentGiven } = useConsentContext();
  const [activeTab, setActiveTab] = useState('support');

  const showForm = isConnected && isConsentGiven;

  return (
    <DualGovernanceFormWrapperStyled>
      <FormWrapperHeader>
        <div>
          <Text size={34} weight={500}>
            Dual Governance
          </Text>
          <Text>i</Text>
        </div>
        {showForm && (
          <ToggleButton
            onChange={setActiveTab}
            items={[
              { label: 'Support', value: 'support' },
              { label: 'My tokens in DG', value: 'revoke' },
            ]}
          />
        )}
      </FormWrapperHeader>

      {showForm ? (
        <>
          {activeTab === 'support' && <SupportForm />}
          {activeTab === 'revoke' && <RevokeForm />}
        </>
      ) : (
        <DualGovernanceExplainer />
      )}
    </DualGovernanceFormWrapperStyled>
  );
};
