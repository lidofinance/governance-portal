import styled, { css, keyframes } from 'styled-components';
import {
  ProgressBarFiller,
  ProgressBarOutline,
} from 'shared/components/progress-bar/styles';

const stripeMove = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(9.2376px); }
`;

const STRIPE_COLOR = '#ffffff26';
const INACTIVE_FILL = '#7A8AA0';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`;

export const LabelWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ProgressSection = styled.div`
  display: flex;
  gap: 4px;
  width: 100%;

  & ${ProgressBarOutline} {
    height: 8px;
  }
`;

export const BarSlot = styled.div<{
  $grow: number;
  $active?: boolean;
}>`
  flex: ${({ $grow }) => $grow} 1 0;
  min-width: 0;
  transition: flex-grow 0.3s ease;

  ${({ $active }) =>
    $active
      ? css`
          & ${ProgressBarFiller} {
            position: relative;
            overflow: hidden;
          }

          & ${ProgressBarFiller}::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: -16px;
            right: -16px;
            background-image: repeating-linear-gradient(
              -60deg,
              ${STRIPE_COLOR} 0,
              ${STRIPE_COLOR} 4px,
              transparent 4px,
              transparent 8px
            );
            will-change: transform;

            @media (prefers-reduced-motion: no-preference) {
              animation: ${stripeMove} 1s linear infinite;
            }
          }
        `
      : css`
          & ${ProgressBarOutline} ${ProgressBarFiller} {
            background-color: ${INACTIVE_FILL};
          }
        `}
`;

export const CountdownRow = styled.div`
  display: flex;
  gap: 4px;
  font-size: 12px;
  color: var(--lido-color-textSecondary);
  justify-content: flex-end;
`;

export const CountdownValue = styled.span`
  color: var(--lido-color-text);
`;
