import { Text } from '@lidofinance/lido-ui';
import { SummaryItem } from './summary-item';
import { StateInfo } from './state_info';
import { SummaryWrapper } from './styles';
import { SupportInfo } from './support_info/support-info';
import { RageQuitInfo } from './rage_quit_info/rage-quit-info';
import { useDualGovernanceState } from 'providers/dual-governance-state';
import { GovernanceStateIndicator } from '../../../types/dual-governance';

export const Summary = () => {
  const { currentGovernanceState } = useDualGovernanceState();

  return (
    <SummaryWrapper>
      {currentGovernanceState ? (
        <SummaryItem label="State">
          <StateInfo state={currentGovernanceState} />
        </SummaryItem>
      ) : null}
      <SummaryItem label="stETH veto support">
        <SupportInfo />
      </SummaryItem>
      {/*<SummaryItem label="Phase ends">*/}
      {/*  <PhaseEndInfo />*/}
      {/*</SummaryItem>*/}
      {currentGovernanceState === GovernanceStateIndicator.Blocked && (
        <SummaryItem label="RageQuit">
          <RageQuitInfo />
        </SummaryItem>
      )}

      <SummaryItem stickBottom>
        <Text>Pendding proposals</Text>
        <Text>3</Text>
      </SummaryItem>
    </SummaryWrapper>
  );
};
