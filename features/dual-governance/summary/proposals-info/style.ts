import styled from 'styled-components';
import { InlineLoader } from '@lidofinance/lido-ui';

export const ProposalsInfoStyled = styled.div`
  display: flex;
  margin-top: auto;
  flex-direction: column;
  gap: 16px;

  & > div {
    flex: 1;
  }
`;

export const InlineLoaderStyled = styled(InlineLoader)`
  width: 40px;
  height: 20px;
`;
