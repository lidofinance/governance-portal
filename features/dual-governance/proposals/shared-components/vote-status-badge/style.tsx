import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { BadgeVariant } from '@dg/proposals/shared-components/vote-status-badge/types';

const variantStyles: Record<BadgeVariant, FlattenSimpleInterpolation> = {
  warning: css`
    background-color: var(--accent-color-coral-light);
  `,
  default: css`
    background-color: #1312170f;
  `,
  success: css`
    background-color: var(--accent-color-leaf-light);
  `,
  danger: css`
    background-color: var(--accent-color-berry-light);
  `,
};

type Props = {
  $variant: BadgeVariant;
};

// TODO: Move to shared components
export const Badge = styled.div<Props>`
  ${({ $variant }) => variantStyles[$variant]}
  padding: 6px 20px;
  border-radius: 40px;
  flex-grow: 0;
  font-size: 15px;
  line-height: 1.8;
  flex-shrink: 0;
  color: var(--primary-color-black-72);
`;

export const VotePhaseWrapper = styled.div`
  margin-top: 12px;
  p {
    color: var(--primary-color-black-72);
  }
`;
