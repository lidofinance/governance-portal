import styled, { css } from 'styled-components';

export const MetaWrap = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: ${({ theme }) => theme.spaceMap.xl}px;
  font-size: 14px;
`;

export const BadgeGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TimeGroup = styled.div<{ $labeled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $labeled }) => ($labeled ? '54px' : '8px')};
  ${({ $labeled }) =>
    $labeled &&
    css`
      margin-left: auto;
    `}
`;

type StatusVariant = 'active' | 'success' | 'error' | 'warning';

const variantStyles: Record<StatusVariant, ReturnType<typeof css>> = {
  active: css`
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    color: var(--lido-color-warning);
    background-color: #ec860026;
  `,
  success: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px 4px 4px;
    border-radius: 20px;
    color: var(--lido-color-success);
    background-color: #53ba9526;

    & svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  `,
  error: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px 4px 4px;
    border-radius: 20px;
    color: var(--lido-color-error);
    background-color: #e14d4d26;

    & svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  `,
  warning: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px 4px 4px;
    border-radius: 20px;
    color: var(--lido-color-warning);
    background-color: #ec860026;

    & svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  `,
};

export const StatusBadge = styled.span<{ $variant: StatusVariant }>`
  font-weight: 700;
  ${({ $variant }) => variantStyles[$variant]}
`;

type PhaseVariant = 'default' | 'enacted' | 'enactable' | 'phase';

const phaseVariantStyles: Record<PhaseVariant, ReturnType<typeof css>> = {
  default: css`
    color: var(--lido-color-textSecondary);
  `,
  enacted: css`
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    color: var(--lido-color-success);
    background-color: #53ba9526;
    font-weight: 700;
  `,
  enactable: css`
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    color: var(--lido-color-warning);
    background-color: #ec860026;
    font-weight: 700;
  `,
  phase: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border-radius: 20px;
    color: var(--accent-color-sky);
    background-color: #00a3ff26;
    font-weight: 700;

    & svg {
      width: 20px;
      height: 20px;
    }

    & svg path {
      fill-opacity: 1;
    }
  `,
};

export const PhaseBadge = styled.span<{ $variant?: PhaseVariant }>`
  ${({ $variant = 'default' }) => phaseVariantStyles[$variant]}
`;

export const PhaseNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--accent-color-sky);
  color: var(--lido-color-foreground);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
`;

export const MetaLabel = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--lido-color-textSecondary);
`;

export const MetaCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const VoteIdText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--lido-color-text);
`;

export const Separator = styled.span`
  display: inline-block;
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background-color: var(--lido-color-textSecondary);
`;

export const CountdownText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--lido-color-text);
`;

export const EndedText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--lido-color-textSecondary);
`;

export const TooltipText = styled.span`
  font-size: 12px;
`;

export const TooltipIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
`;
