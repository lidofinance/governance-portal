import { ProgressBar } from 'shared/components/progress-bar';
import {
  RageQuitProgressBarDescription,
  RageQuitProgressBarPercentage,
  RageQuitProgressBarWrapper,
} from './styles';

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
