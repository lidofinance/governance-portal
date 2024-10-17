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
  p {
    color: white;
  }
`;

export const ActionsWrapper = styled.div`
  margin-top: 30px;
`;
