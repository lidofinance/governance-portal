import styled, { css } from 'styled-components';

export type BadgeVariant =
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow'
  | 'deepBlue'
  | 'deepGreen'
  | 'deepYellow'
  | 'pink'
  | 'purple';

const variantStyles: Record<BadgeVariant, ReturnType<typeof css>> = {
  blue: css`
    color: var(--accent-color-sky);
    background-color: #00a3ff26;
  `,
  green: css`
    color: var(--lido-color-success);
    background-color: #53ba9526;
  `,
  red: css`
    color: var(--lido-color-error);
    background-color: #e14d4d26;
  `,
  yellow: css`
    color: var(--lido-color-warning);
    background-color: #ec860026;
  `,
  deepBlue: css`
    background-color: #e7f1ff;
    color: #175cd3;
  `,
  deepGreen: css`
    background-color: #dff7f2;
    color: #087c72;
  `,
  deepYellow: css`
    background-color: #fff1d6;
    color: #a85600;
  `,
  pink: css`
    background-color: #fde7f7;
    color: #b4238a;
  `,
  purple: css`
    background-color: #efe7ff;
    color: #6c3bd1;
  `,
};

export const Wrap = styled.span<{
  $variant: BadgeVariant;
  $withLeftIcon?: boolean;
  $withRightIcon?: boolean;
}>`
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  border-radius: 20px;
  gap: 4px;
  padding: 4px 12px;

  & svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }

  ${({ $withLeftIcon }) =>
    $withLeftIcon &&
    css`
      padding-left: 4px;
    `}

  ${({ $withRightIcon }) =>
    $withRightIcon &&
    css`
      padding-right: 4px;
    `}

  ${({ $variant }) => variantStyles[$variant]}
`;
