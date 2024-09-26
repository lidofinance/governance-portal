import { SummaryItem } from './summary-item';
import { StateInfo } from './state_info';
import { SummaryWrapper } from './styles';
import { GovernanceStateIndicator } from '../../../types/dual-governance';
import { SupportInfo } from './support_info/support-info';
import { PhaseEndInfo } from './phase_end_info/phase-end-info';
import { RageQuitInfo } from './rage_quit_info/rage-quit-info';

export const Summary = () => {
  return (
    <SummaryWrapper>
      <SummaryItem label="State">
        <StateInfo state={GovernanceStateIndicator.Blocked} />
      </SummaryItem>
      <SummaryItem label="stETH supports vetoing">
        <SupportInfo />
      </SummaryItem>
      <SummaryItem label="Phase ends">
        <PhaseEndInfo />
      </SummaryItem>
      <SummaryItem label="RageQuit">
        <RageQuitInfo />
      </SummaryItem>

      {/*<SummaryItem stickBottom>*/}
      {/*  <h2>Community Discussion & Committee Reactions</h2>*/}
      {/*</SummaryItem>*/}
    </SummaryWrapper>
  );
};
