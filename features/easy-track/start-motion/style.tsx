import styled from 'styled-components';
import { Text } from 'shared/components/text';

export const PageTitle = styled(Text).attrs({
  size: 26,
  weight: 800,
})`
  line-height: 1;
  text-align: center;
`;

export const PageSubtitle = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-top: 8px;
  opacity: 0.6;
  text-align: center;
  margin-bottom: 40px;
`;

export const PageConnectMessageBox = styled.div`
  margin-bottom: 20px;
  padding: 20px 15px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md + 'px'};
`;
