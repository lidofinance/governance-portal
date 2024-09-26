import styled from 'styled-components';
import { Button, ButtonProps } from '@lidofinance/lido-ui';

export const ConnectButton = styled(Button)<ButtonProps>`
  padding: 15px 42px;
  border-radius: 60px;
  background: var(--custom-inverse-color-black);
  color: var(--custom-inverse-color-white);
  &:not(:disabled):hover {
    background-color: var(--lido-color-primary);
  }
`;
