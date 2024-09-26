import { BoldMetric, RageQuitInfoWrapper, StyledText, Divider } from './styles';
import { RageQuitProgressBar } from './rage-quit-progress-bar';

const totalValue = '903,360.295';
const haveQuitedValue = '506,312.765';

export const RageQuitInfo = () => {
  return (
    <>
      <RageQuitInfoWrapper>
        <StyledText $size="34px">
          <BoldMetric>{haveQuitedValue}</BoldMetric>
          <Divider>/</Divider>
        </StyledText>
        <StyledText $size="16px">
          <BoldMetric>{totalValue}</BoldMetric>
          <span> stETH is withdrawn</span>
        </StyledText>
      </RageQuitInfoWrapper>
      <RageQuitProgressBar />
    </>
  );
};
