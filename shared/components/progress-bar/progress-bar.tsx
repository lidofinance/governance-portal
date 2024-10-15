import { ProgressBarContainer, ProgressBarFiller } from './styles';

interface Props {
  variant: 'danger' | 'success';
  progress: number;
}

export const ProgressBar = ({ variant, progress }: Props) => {
  return (
    <ProgressBarContainer $variant={variant}>
      <ProgressBarFiller $progress={progress} $variant={variant} />
    </ProgressBarContainer>
  );
};
