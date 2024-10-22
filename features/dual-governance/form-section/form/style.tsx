import { FC } from 'react';
import styled, { css } from 'styled-components';
import { Button, Text, Select, SelectProps } from '@lidofinance/lido-ui';
import { InputAmount } from 'shared/components/input-amount';

export const FormWrapper = styled.section`
  padding: 20px 0 40px 20px;
  width: 100%;
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

export const FormHeader = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const customInputStyles = css`
  margin-top: -1px;
  margin-bottom: 20px;
  width: 100%;
  span {
    padding: 18px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;

    input {
      font-size: 18px;
    }

    button {
      background-color: #0085ff1a;
      color: #0085ff;
      opacity: 1;
      padding: 12px 2px;
      font-size: 18px;
      border-radius: 30px;
      font-weight: normal;
      min-width: 0;
    }
  }
`;

export const StyledInput = styled(InputAmount)`
  ${customInputStyles}
`;

type StyledSelectProps = Omit<SelectProps, 'value' | 'onChange'> & {
  $value: string;
  $onChange: (val: string) => void;
};
export const StyledSelect = styled(Select).attrs<StyledSelectProps>(
  (props) => ({
    value: props.$value,
    onChange: props.$onChange,
  }),
)`
  width: 50%;
  ${customInputStyles}
` as FC<StyledSelectProps>;
