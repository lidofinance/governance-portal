import { Block } from '@lidofinance/lido-ui';

import styled from 'styled-components';

export const ActionCardWrapper = styled(Block)`
  display: flex;
  flex-direction: column;
  border-radius: 40px;
`;

export const ActionCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  height: 100%;
`;

export const ActionIconWrapper = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 1px solid #1312171a;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ActionTitleWrapper = styled.div`
  margin-top: 24px;
  margin-bottom: 12px;

  p {
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
      path {
        fill: #131217b8;
      }
    }
  }
`;
