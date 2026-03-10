import styled, { css } from 'styled-components';
import { Text } from 'shared/components/text';
import { Block } from '@lidofinance/lido-ui';
import { MotionDisplayStatus, MotionStatus } from '../types';

export const CardTitle = styled(Text).attrs({
  size: 14,
  weight: 800,
  as: 'h3',
})`
  margin-bottom: 8px;
`;

export const DescWrapper = styled.div`
  margin-bottom: auto;
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

const warnStyles = css`
  p {
    color: var(--lido-color-error);
  }
  ${DescWrapper} div {
    color: var(--lido-color-error);
  }
  ${BadgeWrapper} p {
    color: var(--primary-color-black-50);
  }
`;

const succeedStyles = css`
  p {
    color: var(--accent-color-leaf);
  }
  ${BadgeWrapper} p {
    color: var(--primary-color-black-50);
  }
`;

const statusStyles = {
  [MotionDisplayStatus.ACTIVE]: undefined,
  [MotionDisplayStatus.ATTENDED]: undefined,
  [MotionDisplayStatus.DANGER]: warnStyles,
  [MotionDisplayStatus.ATTENDED_DANGER]: warnStyles,
  [MotionDisplayStatus.ENACTED]: succeedStyles,
  [MotionDisplayStatus.DEFAULT]: undefined,
} as const;

type CardProps = {
  $displayStatus?: MotionDisplayStatus;
};

export const Card = styled(Block)<CardProps>`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 250px;

  ${({ $displayStatus }) => $displayStatus && statusStyles[$displayStatus]}
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

export const EnactDate = styled(Text).attrs({
  size: 26,
  weight: 600,
})`
  margin: 0 0 12px;
`;
