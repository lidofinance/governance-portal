import styled from 'styled-components';
import { Button, Text } from '@lidofinance/lido-ui';

export const FormWrapper = styled.section`
  padding: 0 40px;
`;

export const FormTitle = styled.h1`
  font-size: 34px;
  color: #000;
  font-weight: 500;
`;

export const FormDescription = styled(Text)`
  font-size: 22px;
  color: #131217b8;
  //margin-top: ${({ theme }) => theme.spaceMap.xl}px;
  margin-top: 70px;
`;

export const ConnectButton = styled(Button)`
  margin-top: 74px;
  padding: 18px 36px;
  border-radius: 60px;
  background: var(--custom-inverse-color-black);
  color: var(--custom-inverse-color-white);
  &:not(:disabled):hover {
    background-color: var(--lido-color-primary);
  }
`;
