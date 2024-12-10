import styled from 'styled-components';

export type ProgressBarColorVariant = 'default' | 'danger' | 'success';

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

  & > ${ProgressBarOutline} {
  background-color: ${({ $variant }) => progressBarColors[$variant].container};

    & > ${ProgressBarFiller} {
      width: ${({ $progress }) => `${$progress}%`};
      background-color: ${({ $variant }) => progressBarColors[$variant].filler};
    }
  }


  & > ${ProgressBarInfo} {
    & > span:first-child {
    color: ${({ $variant }) => progressBarColors[$variant].filler};
   }
`;
