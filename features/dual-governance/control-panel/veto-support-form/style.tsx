import { InlineLoader } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TokenSelectStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  & label {
    user-select: none;
    cursor: pointer;
    display: block;
    padding: 20px;
    & > input {
      display: none;
    }
  }
`;

export const SupportFormAdditionalInfoStyled = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;

  & > div {
    height: 24px;
  }
`;

export const AdditionalInfoLoader = styled(InlineLoader)`
  height: 16px;
  max-width: 100px;
`;
