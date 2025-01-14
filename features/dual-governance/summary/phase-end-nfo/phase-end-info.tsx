import { BoldMetric, PhaseEndInfoStyled } from './style';
import { DGTooltip } from 'features/dual-governance/tooltips';

const countdownValue = '13:34:55';
const Countdown = () => <BoldMetric>in {countdownValue}</BoldMetric>;

export const PhaseEndInfo = () => {
  return (
    <PhaseEndInfoStyled>
      RageQuit <DGTooltip topic="rageQuit" /> activates if{' '}
      <BoldMetric>3.97%</BoldMetric> more stETH is gained
      <br />
      <Countdown />
    </PhaseEndInfoStyled>
  );
};
