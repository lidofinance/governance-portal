import {
  ControlPanelWrapper,
  ControlPanelHeader,
  InlineLoaderStyled,
} from './style';
import { Text } from 'shared/components/text';
import { ToggleButton } from 'shared/components/toggle-button';
import { useCallback, useEffect, useState } from 'react';
import { VetoSupportForm } from './veto-support-form';
import { RevocationPanel } from './revocation-panel';
import { DualGovernanceControlPanelPreview } from './preview';
import { useEscrowBalances } from '../hooks/use-escrow-balances';
import { GovernanceState } from '../types';
import { useDualGovernanceContext } from 'providers/dual-governance';

export const DualGovernanceControlPanel = () => {
  const { detailedState } = useDualGovernanceContext();

  const [activeTab, setActiveTab] = useState(
    detailedState?.persistedState === GovernanceState.RageQuit
      ? 'revoke'
      : 'support',
  );
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  const { data, isLoading } = useEscrowBalances();

  useEffect(() => {
    if (data && data.totalLockedSharesInEscrows !== 0n) {
      setIsPreviewVisible(false);
    }
  }, [data]);

  const handleClosePreview = useCallback(() => {
    setIsPreviewVisible(false);
  }, []);

  if (isLoading) {
    return (
      <ControlPanelWrapper>
        <InlineLoaderStyled />
      </ControlPanelWrapper>
    );
  }

  if (isPreviewVisible) {
    return (
      <DualGovernanceControlPanelPreview onContinue={handleClosePreview} />
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
          value={activeTab}
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
