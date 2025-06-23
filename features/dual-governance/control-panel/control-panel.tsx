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
import { VisibleGovernanceState } from '../types';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';

export const DualGovernanceControlPanel = () => {
  const { visibleState } = useDualGovernanceStateContext();
  const [activeTab, setActiveTab] = useState('support');

  useEffect(() => {
    if (visibleState === VisibleGovernanceState.BlockedRageQuit) {
      setActiveTab('revoke');
    } else if (visibleState !== VisibleGovernanceState.Loading) {
      setActiveTab('support');
    }
  }, [visibleState]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  const { data, isLoading } = useEscrowBalances();

  useEffect(() => {
    if (data && data.totalLockedSharesInEscrows !== 0n) {
      setIsPreviewVisible(false);
    } else {
      setIsPreviewVisible(true);
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
