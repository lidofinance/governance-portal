import { InlineLoader } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ActionsWrapper = styled.div`
  margin-top: 30px;
`;

export const TokenSelectStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
