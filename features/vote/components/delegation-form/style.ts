import styled from 'styled-components';
import { Button, Text } from '@lidofinance/lido-ui';
import { FormController } from 'shared/hook-form/form-controller';

export const DelegationFormControllerStyled = styled(FormController)`
  display: flex;
  flex-direction: column;
`;

export const DelegationFormBalanceStyled = styled.div<{ $withError: boolean }>`
  margin-top: ${({ $withError }) => ($withError ? '32px' : '12px')};
  display: flex;
  gap: 16px;
  justify-content: space-between;
`;

export const Balance = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  & > p {
    font-size: 12px;

    &:first-child {
      opacity: 0.6;
    }
  }
`;

export const DelegateButton = styled(Button)`
  margin-top: 16px;
  @media (max-width: 440px) {
    padding-left: 12px;
    padding-right: 12px;
  }
`;

export const HiddenButton = styled(Button)`
  display: none;
`;

export const DelegationFormFootNoteStyled = styled(Text).attrs({
  size: 'xxs',
  color: 'secondary',
})`
  margin-top: 8px;
`;
