import { Text } from '@lidofinance/lido-ui';
import { SummaryItem } from './summary-item';
import { StateInfo } from './state-info';
import { SummaryWrapper } from './style';
import { SupportInfo } from './support-info/support-info';
import { RageQuitInfo } from './rage-quit-info/rage-quit-info';
import { useDualGovernanceState } from 'providers/dual-governance-state';
import { GovernanceStateIndicator } from 'features/dual-governance/types';

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

      <SummaryItem>
        <Text>
          Veto Signaling starts if <b>0.87%</b> more stETH is added
        </Text>
      </SummaryItem>

      <SummaryItem stickBottom>
        <Text>Pendding proposals</Text>
        <Text>3</Text>
      </SummaryItem>
    </SummaryWrapper>
  );
};
