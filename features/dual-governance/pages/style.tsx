import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';
import { devicesHeaderMedia } from 'styles/global';

export const DashboardWrapper = styled(Block)`
  border: 1px solid var(--custom-border);
  background: none;
  padding: 0;
  border-radius: 60px;
  display: flex;
  min-height: 530px;

  @media ${devicesHeaderMedia.tablet} {
    flex-direction: column;
  }
`;
