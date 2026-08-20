import styled, { css } from 'styled-components';

export type BadgeType = 'primary' | 'secondary';

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

const getBadgeColorStyles = (variant: BadgeVariant, type: BadgeType) => {
  switch (variant) {
    case 'blue':
      return css`
        color: var(--accent-color-sky);
        background-color: #00a3ff26;
      `;
    case 'green':
      return css`
        color: var(--lido-color-success);
        background-color: #53ba9526;
      `;
    case 'red':
      return css`
        color: var(--lido-color-error);
        background-color: #e14d4d26;
      `;
    case 'yellow':
      return css`
        color: var(--lido-color-warning);
        background-color: #ec860026;
      `;
    case 'deepBlue':
      if (type === 'secondary') {
        return css`
          background-color: #f3f7ff;
          color: #3970c7;
        `;
      }

      return css`
        background-color: #e7f1ff;
        color: #175cd3;
      `;
    case 'deepGreen':
      if (type === 'secondary') {
        return css`
          background-color: #f2faf8;
          color: #258675;
        `;
      }

      return css`
        background-color: #dff7f2;
        color: #087c72;
      `;
    case 'deepYellow':
      return css`
        background-color: #fff1d6;
        color: #a85600;
      `;
    case 'pink':
      return css`
        background-color: #fde7f7;
        color: #b4238a;
      `;
    case 'purple':
      return css`
        background-color: #efe7ff;
        color: #6c3bd1;
      `;
  }
};

export const Wrap = styled.span<{
  $variant: BadgeVariant;
  $type: BadgeType;
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

  ${({ $variant, $type }) => getBadgeColorStyles($variant, $type)}
`;
