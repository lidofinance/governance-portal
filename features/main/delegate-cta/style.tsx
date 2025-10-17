import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

export const DelegateCtaWrapper = styled(Block)`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 0 0 1px #1312171a;
  border-radius: 40px;
  padding: 32px;
  background: #ffffff linear-gradient(to left, #ffaa7d99, #ffaa7d26);
  overflow: hidden;
`;

export const InfoWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const IconWrapper = styled.div`
  background: #ffaa7d;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 48px #ffaa7d33;
`;
