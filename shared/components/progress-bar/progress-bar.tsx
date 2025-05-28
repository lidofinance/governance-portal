import { Text } from '../text';
import {
  ProgressBarFiller,
  ProgressBarInfo,
  ProgressBarOutline,
  ProgressBarWrapper,
  ProgressBarColorVariant,
} from './styles';

type Props = {
  variant?: ProgressBarColorVariant;
  progressPercent: number | undefined;
  totalPercent: number | undefined;
  showProgressInfo?: boolean;
  progressTitle?: string;
  totalTitle?: string;
};

export const ProgressBar = (props: Props) => {
  const {
    variant = 'default',
    progressPercent,
    totalPercent,
    showProgressInfo = true,
    progressTitle,
    totalTitle,
  } = props;

  if (progressPercent === undefined || !totalPercent) {
    return null;
  }

  // const progress = (progressPercent / totalPercent) * 100;

  // const roundProgress = Math.round(progress * 100) / 100;

  return (
    <ProgressBarWrapper $variant={variant} $progress={progressPercent}>
      <ProgressBarOutline>
        <ProgressBarFiller />
      </ProgressBarOutline>
      {showProgressInfo && (
        <ProgressBarInfo>
          <Text as="span" size={14} weight={600}>
            {progressPercent}% {progressTitle ? progressTitle : ''}
          </Text>
          <Text as="span" size={14} weight={600} color="secondary">
            {totalTitle || ''}
          </Text>
        </ProgressBarInfo>
      )}
    </ProgressBarWrapper>
  );
};
