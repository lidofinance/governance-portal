import { ControlPanelWrapper, ControlPanelHeader } from './style';
import { Text } from 'shared/components/text';
import { ToggleButton } from 'shared/components/toggle-button';
import { useState } from 'react';
import { VetoSupportForm } from './veto-support-form';
import { RevocationPanel } from './revocation-panel';
import { DualGovernanceControlPanelPreview } from './preview';

export const DualGovernanceControlPanel = () => {
  const [activeTab, setActiveTab] = useState('support');
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  if (isPreviewVisible) {
    return (
      <DualGovernanceControlPanelPreview
        onContinue={() => setIsPreviewVisible(false)}
      />
    );
  }

  return (
    <ControlPanelWrapper>
      <ControlPanelHeader>
        <div>
          <Text size={34} weight={500}>
            Dual Governance
          </Text>
        </div>
        <ToggleButton
          onChange={setActiveTab}
          items={[
            { label: 'Support Veto', value: 'support' },
            { label: 'Manage Tokens', value: 'revoke' },
          ]}
        />
      </ControlPanelHeader>
      {activeTab === 'support' && <VetoSupportForm />}
      {activeTab === 'revoke' && <RevocationPanel />}
    </ControlPanelWrapper>
  );
};
