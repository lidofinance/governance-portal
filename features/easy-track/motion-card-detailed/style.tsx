import styled from 'styled-components';
import { Block, Container } from '@lidofinance/lido-ui';
import { BREAKPOINT_MOBILE } from 'styles/global';
import { Text } from 'shared/components/text';
import { MotionDisplayStatus } from '@easy-track/types';
import { MOTION_STATUS_COLOR_MAP } from '@easy-track/constants';

export const MotionContainer = styled(Container).attrs({
  as: 'main',
})`
  margin: 0 auto;
  max-width: 600px;
`;

export const MotionCard = styled(Block)`
  padding: 50px 60px;
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.boxShadows.xl}
    var(--lido-color-shadowLight);

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    margin: 0 20px;
    padding: 20px;
  }
`;

export const Header = styled.div`
  margin-bottom: 64px;
  display: flex;
  justify-content: space-between;
`;

export const MotionNumber = styled(Text).attrs({
  size: 14,
  weight: 800,
})`
  margin-bottom: 3px;
  color: rgba(39, 56, 82, 0.6);
`;

export const HeaderAside = styled.div`
  display: flex;
  align-items: center;
`;

export const StatusLabel = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-bottom: 3px;
  opacity: 0.4;
`;

export const StatusValue = styled(Text).attrs({
  size: 14,
  weight: 800,
})<{ $displayStatus: MotionDisplayStatus }>`
  text-transform: uppercase;
  letter-spacing: 0.4px;

  color: ${({ $displayStatus }) => MOTION_STATUS_COLOR_MAP[$displayStatus]};
`;

export const Description = styled.div`
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 64px;
  color: rgba(39, 56, 82, 0.6);
  word-break: break-all;

  ul {
    padding-left: 20px;
  }
`;

export const DescriptionMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 32px;
  margin-bottom: 16px;
`;

export const InfoRow = styled.div`
  margin-bottom: 64px;
  display: flex;
  justify-content: space-between;
`;

export const InfoCol = styled.div`
  &:nth-child(1) {
    flex: 1 1 auto;
  }

  &:nth-child(2) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 20px;
    flex: 0 1 auto;
    min-width: 0;
    border-left: 1px solid rgba(39, 56, 82, 0.1);
  }
`;

export const StartDateCell = styled.div`
  margin-top: 30px;
`;

export const InfoLabel = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  opacity: 0.4;
  margin-bottom: 4px;
`;

export const StartDateValue = styled.div`
  font-weight: 800;
  font-size: 14px;
  line-height: 22px;
  text-transform: uppercase;
  color: rgba(39, 56, 82, 0.6);
`;
export const StartDateTime = styled.span`
  color: rgba(39, 56, 82, 0.4);
`;

export const InfoCell = styled.div`
  &:not(:last-child) {
    margin-bottom: 26px;
  }
`;

export const EnactWarningBox = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.warningContrast};
  background-color: rgba(236, 134, 0, 1);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  font-weight: 500;
  margin: 20px 0 20px 0;
  padding: 12px;
`;
