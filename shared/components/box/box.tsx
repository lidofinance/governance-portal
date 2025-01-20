import { Box as BoxLib } from '@lidofinance/lido-ui';
import styled from 'styled-components';

type ExtendedBoxProps = {
  gap?: number;
};

export const Box = styled(BoxLib)<ExtendedBoxProps>`
  gap: ${({ gap }) => `${gap}px` || '0px'};
`;
