import styled from 'styled-components';
import { Text } from 'shared/components/text';
import { MotionDisplayStatus } from '../types';
import { MOTION_STATUS_COLOR_MAP } from '@easy-track/constants';

export const CardTitle = styled(Text).attrs({
  size: 14,
  weight: 700,
})`
  color: rgb(39, 56, 82);
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  word-break: break-word;
`;

export const DescWrapper = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  ul,
  li {
    list-style-position: inside;
  }
`;

export const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-radius: 24px;
  background: rgba(39, 56, 82, 0.1);
`;

export const CardStatusWrapper = styled.section<{
  $displayStatus: MotionDisplayStatus;
}>`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;

  & > * {
    color: ${({ $displayStatus }) => MOTION_STATUS_COLOR_MAP[$displayStatus]};
  }
`;
