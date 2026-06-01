import { Text, Theme } from '@lidofinance/lido-ui';
import styled from 'styled-components';

type TextStyledProps = {
  size?: number;
};

type InjectedProps = {
  theme: Theme;
};

type TextLibProps = React.ComponentProps<typeof Text>;

export type TextColor =
  | NonNullable<TextLibProps['color']>
  | 'accent'
  | 'textv1'
  | 'textv1-secondary';

export type TextProps = Omit<TextLibProps, 'size' | 'color'> &
  TextStyledProps & {
    color?: TextColor;
  };

const getTextColor = ({
  theme: { colors },
  color = 'default',
}: TextProps & InjectedProps) => {
  const colorsMap = {
    default: `var(--primary-color-black)`,
    secondary: `var(--primary-color-black-50)`,
    primary: `var(--primary-color-black-72)`,
    warning: colors.warning,
    error: colors.error,
    success: colors.success,
    white: colors.primaryContrast,
    accent: `var(--lido-color-primary)`,
    textv1: `var(--lido-color-text)`,
    'textv1-secondary': `var(--lido-color-textSecondary)`,
  };

  return colorsMap[color];
};

export const TextStyled = styled(Text)<TextStyledProps>`
  font-size: ${({ size }) => size ?? 14}px;
  line-height: 1.4;
  color: ${getTextColor};
`;
