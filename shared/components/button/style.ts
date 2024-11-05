import { Button } from '@lidofinance/lido-ui';
import styled from 'styled-components';

type ButtonStyledProps = {
  variant?: 'dg-primary' | 'dg-secondary';
};

// Restyled version of the Button component from th lido-ui library
export const ButtonStyled = styled(Button)<ButtonStyledProps>`
  padding: 14px 24px;
  border-radius: 32px;
  font-size: 18px;
  background-color: var(--primary-color-black);
  font-weight: 600;
  color: var(--primary-color-white);

  &:hover {
    background-color: var(--primary-color-black-72);
  }

  &:not(:disabled):hover,
  &:focus-visible {
    background-color: var(--primary-color-black-72);
  }
`;
