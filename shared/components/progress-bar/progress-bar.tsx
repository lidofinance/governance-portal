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

  const progress = Math.ceil((progressPercent / totalPercent) * 100);

  return (
    <ProgressBarWrapper $variant={variant} $progress={progress}>
      <ProgressBarOutline>
        <ProgressBarFiller />
      </ProgressBarOutline>
      {showProgressInfo && (
        <ProgressBarInfo>
          <Text as="span" size={14} weight={600}>
            {progressPercent}% {progressTitle ? progressTitle : ''}
          </Text>
          <Text as="span" size={14} weight={600} color="secondary">
            {totalTitle ? `${totalTitle}: ` : ''} {props.totalPercent}%
          </Text>
        </ProgressBarInfo>
      )}
    </ProgressBarWrapper>
  );
};
