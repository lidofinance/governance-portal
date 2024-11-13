import { FC } from 'react';
import styled, { css } from 'styled-components';
import { Text, Select, SelectProps } from '@lidofinance/lido-ui';

export const DualGovernanceFormWrapperStyled = styled.div<{
  $withGaps?: boolean;
}>`
  padding: 40px;
  width: 60%;
  background: #fff;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  display: flex;
  flex-direction: column;
`;

export const FormWrapperHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26px;

  & > div:first-child {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export const FormDescription = styled(Text)`
  font-size: 22px;
  color: #131217b8;
  //margin-top: ${({ theme }) => theme.spaceMap.xl}px;
  margin-top: 70px;
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

export const DualGovernanceExplainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
  flex: 1;

  p {
    line-height: 40px !important;
  }

  b {
    font-size: 22px;
  }
`;

export const ExplainerButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;

  button {
    width: auto;
  }
`;
