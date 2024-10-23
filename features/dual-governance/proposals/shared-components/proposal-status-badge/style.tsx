import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { BadgeVariant } from 'features/dual-governance/proposals/shared-components/proposal-status-badge/types';

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
};

type Props = {
  $variant: BadgeVariant;
};

export const ProposalStatusBadgeWrapper = styled.div<Props>`
  ${({ $variant }) => variantStyles[$variant]}
  padding: 6px 20px;
  border-radius: 40px;
  flex-grow: 0;
  font-size: 15px;
  line-height: 1.8;
`;
