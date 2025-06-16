import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';
import { devicesHeaderMedia } from '../../../styles/global';

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

export const WarningReleaseBanner = styled.div`
  background: rgba(255, 142, 118, 0.8);
  padding: 20px;
  margin-bottom: 40px;
  border-radius: 16px;
  color: white;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
