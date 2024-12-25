import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { BadgeVariant } from 'features/dual-governance/proposals/shared-components/status-badge/types';

const variantStyles: Record<BadgeVariant, FlattenSimpleInterpolation> = {
  warning: css`
    background-color: var(--accent-color-coral-light);
    color: var(--accent-color-coral);
  `,
  default: css`
    background-color: #1312170f;
    color: var(--primary-color-black-72);
  `,
  success: css`
    background-color: var(--accent-color-leaf-light);
    color: var(--accent-color-leaf);
  `,
  danger: css`
    background-color: var(--accent-color-berry-light);
    color: var(--accent-color-berry);
  `,
};

type Props = {
  $variant: BadgeVariant;
};

export const Badge = styled.div<Props>`
  ${({ $variant }) => variantStyles[$variant]}
  padding: 4px 14px;
  border-radius: 40px;
  flex-grow: 0;
  font-size: 15px;
  line-height: 1.8;
  flex-shrink: 0;
`;

export const VotePhaseWrapper = styled.div`
  margin-top: 12px;
`;
