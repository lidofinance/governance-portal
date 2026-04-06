import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

export const MotionLimitProgressWrapper = styled(Block)`
  margin: 20px 0;
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ProgressDesc = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

export const LimitDesc = styled.div`
  font-size: 14px;
  min-width: 0;
  word-break: break-all;
`;

export const Limit = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ProgressPeriodWrapper = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;

type InjectedPropsTargetLine = {
  $negative?: boolean;
  $width: number;
};

export const ProgressBarLine = styled.div`
  margin: 8px 0;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm + 'px'};
  width: 100%;
  height: 20px;
  background: #eff2f6;
  position: relative;
  overflow: hidden;
`;

export const SpentLine = styled.div<{ $width: number; $newWidth: number }>`
  background-color: ${({ theme }) => theme.colors.success};
  height: 100%;
  width: ${({ $width }) => $width}%;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm + 'px'};
  overflow: hidden;
  position: relative;
`;

export const TargetLine = styled.div<InjectedPropsTargetLine>`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm + 'px'};
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: hidden;
  background-color: ${({ $negative, theme }) =>
    $negative ? theme.colors.error : 'rgba(83, 186, 149, 0.5)'};
  opacity: 0.5;
  width: ${({ $width }) => $width}%;
`;
