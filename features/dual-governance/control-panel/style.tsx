import { FC } from 'react';
import styled, { css } from 'styled-components';
import { Select, SelectProps } from '@lidofinance/lido-ui';

export const ControlPanelWrapper = styled.div<{
  $withGaps?: boolean;
}>`
  padding: 40px;
  width: 60%;
  background: rgba(255, 255, 255, 0.9);
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  display: flex;
  flex-direction: column;
`;

export const ControlPanelHeader = styled.div`
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
