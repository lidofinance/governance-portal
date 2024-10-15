import styled from 'styled-components';
import { InputAmount } from 'shared/components/input-amount';

export const FormWrapper = styled.div`
  width: 100%;
  margin-top: 24px;
`;

export const TabContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

export const TokenWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: auto;
`;

export const StyledInput = styled(InputAmount)`
  margin-top: -1px;
  margin-bottom: 20px;
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

export const SummaryRow = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
`;

export const ActionButton = styled.button`
  background-color: black;
  width: 100%;
  color: white;
  padding: 20px 30px;
  border-radius: 30px;
  cursor: pointer;
`;

export const ActionsWrapper = styled.div`
  margin-top: 30px;
`;
