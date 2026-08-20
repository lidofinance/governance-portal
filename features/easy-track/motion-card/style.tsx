import styled from 'styled-components';
import { Text } from 'shared/components/text';
import { MotionDisplayStatus } from '../types';
import { MOTION_STATUS_COLOR_MAP } from '@easy-track/constants';

export const CardTitle = styled(Text).attrs({
  size: 16,
  weight: 700,
})`
  color: var(--lido-color-text);
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  word-break: break-word;
`;

export const DescWrapper = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  color: var(--lido-color-text);

  ul,
  li {
    list-style-position: inside;
  }

  &,
  * {
    font-weight: 400;
  }
`;

export const CardStatusWrapper = styled.section<{
  $displayStatus: MotionDisplayStatus;
}>`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > * {
    color: ${({ $displayStatus }) => MOTION_STATUS_COLOR_MAP[$displayStatus]};
    line-height: 1;
  }
`;

export const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;
