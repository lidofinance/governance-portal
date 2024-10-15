import styled from 'styled-components';

type ContainerProps = {
  $variant: 'danger' | 'success';
};

type FillerProps = ContainerProps & {
  $progress: number;
};

const barColorStyles = {
  danger: {
    container: '#D74758',
    filler: '#D7475880',
  },
  success: {
    container: '#29C38C',
    filler: '#29C38C',
  },
};

export const ProgressBarContainer = styled.div<ContainerProps>`
  border-radius: 8px;
  height: 4px;
  background-color: ${({ $variant }) => barColorStyles[$variant].filler};
`;

export const ProgressBarFiller = styled.div<FillerProps>`
  border-radius: 8px;
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};
  background-color: ${({ $variant }) => barColorStyles[$variant].filler};
`;
