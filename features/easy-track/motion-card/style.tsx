import styled, { css } from 'styled-components';
import { Text } from 'shared/components/text';
import { Block } from '@lidofinance/lido-ui';
import { MotionStatus } from '../motion-types';

export const CardTitle = styled(Text).attrs({
  size: 14,
  weight: 800,
})`
  margin-bottom: 8px;
`;

export const Card = styled(Block)`
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

export const CardStatusWrapper = styled.section<{ $status?: string }>`
  display: flex;
  flex-direction: column;

  ${({ $status }) =>
    $status === MotionStatus.ENACTED &&
    css`
      p {
        color: var(--accent-color-leaf);
      }
    `}

  ${({ $status }) =>
    $status === MotionStatus.CANCELED &&
    css`
      p {
        color: var(--primary-color-black-50);
      }
    `}
`;

export const CardStatus = styled(Text).attrs({
  size: 10,
  weight: 600,
})`
  margin-top: 12px;
`;

export const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-radius: 24px;
  background: rgba(39, 56, 82, 0.1);
`;

export const EnactDate = styled(Text).attrs({
  size: 26,
  weight: 600,
})`
  margin: 0 0 12px;
`;
