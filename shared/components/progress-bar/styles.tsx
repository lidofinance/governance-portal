import styled from 'styled-components';

export type ProgressBarColorVariant =
  | 'default'
  | 'danger'
  | 'success'
  | 'primary';

type ContainerProps = {
  $variant: ProgressBarColorVariant;
  $progress: number;
};

const progressBarColors: Record<
  ProgressBarColorVariant,
  { container: string; filler: string }
> = {
  default: {
    container: 'var(--primary-color-black-20)',
    filler: 'var(--primary-color-black)',
  },
  danger: {
    container: 'rgba(215, 71, 88, 0.2)',
    filler: 'rgba(215, 71, 88, 1)',
  },
  success: {
    container: '#29C38C',
    filler: '#29C38C',
  },
  primary: {
    container: 'rgba(0, 163, 255, 0.2)',
    filler: 'var(--lido-color-primary)',
  },
};

export const ProgressBarFiller = styled.div`
  border-radius: 8px;
  height: 100%;
`;

export const ProgressBarInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  height: 27px;
`;

export const ProgressBarOutline = styled.div`
  border-radius: 8px;
  height: 4px;
`;

export const ProgressBarWrapper = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;

  & > ${ProgressBarOutline} {
  background-color: ${({ $variant }) => progressBarColors[$variant].container};

    & > ${ProgressBarFiller} {
      width: ${({ $progress }) => `${$progress}%`};
      max-width: 100%;
      background-color: ${({ $variant }) => progressBarColors[$variant].filler};
    }
  }


  & > ${ProgressBarInfo} {
    & > span:first-child {
    color: ${({ $variant }) => progressBarColors[$variant].filler};
   }
`;
