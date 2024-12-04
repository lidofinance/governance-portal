import { ProgressBar } from 'shared/components/progress-bar';
import {
  RageQuitProgressBarDescription,
  RageQuitProgressBarPercentage,
  RageQuitProgressBarWrapper,
} from './style';

export const RageQuitProgressBar = () => {
  return (
    <>
      <RageQuitProgressBarWrapper>
        <ProgressBar progress={56} variant="danger"></ProgressBar>
      </RageQuitProgressBarWrapper>
      <RageQuitProgressBarDescription>
        <RageQuitProgressBarPercentage>56%</RageQuitProgressBarPercentage>
        {' completed'}
      </RageQuitProgressBarDescription>
    </>
  );
};
