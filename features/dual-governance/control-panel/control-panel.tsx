import { ControlPanelWrapper, ControlPanelHeader } from './style';
import { Text } from 'shared/components/text';
import { ToggleButton } from 'shared/components/toggle-button';
import { useEffect, useState } from 'react';
import { VetoSupportForm } from './veto-support-form';
import { RevocationPanel } from './revocation-panel';
import { DualGovernanceControlPanelPreview } from './preview';
import { useEscrowBalances } from '../hooks/use-escrow-balances';
import { DGTooltip } from '../tooltips';
import { useAccount } from 'wagmi';

export const DualGovernanceControlPanel = () => {
  const [activeTab, setActiveTab] = useState('support');
  const { isConnected } = useAccount();
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  const { data } = useEscrowBalances();

  useEffect(() => {
    if (data && data.lockedSharesInEscrow !== 0n) {
      setIsPreviewVisible(false);
    }
  }, [data]);

  if (isPreviewVisible || !isConnected) {
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
            Dual Governance <DGTooltip topic="dualGovernance" />
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
