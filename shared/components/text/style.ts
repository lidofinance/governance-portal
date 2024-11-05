import { Text, Theme } from '@lidofinance/lido-ui';
import styled from 'styled-components';

type TextStyledProps = {
  size?: 14 | 17 | 19 | 22 | 28 | 34;
};

type InjectedProps = {
  theme: Theme;
};

type TextLibProps = React.ComponentProps<typeof Text>;

export type TextProps = Omit<TextLibProps, 'size'> & TextStyledProps;

const getTextColor = ({
  theme: { colors },
  color = 'default',
}: TextProps & InjectedProps) => {
  const colorsMap = {
    default: `var(--primary-color-black)`,
    secondary: `var(--primary-color-black-50)`,
    primary: `var(--primary-color-black)`,
    warning: colors.warning,
    error: colors.error,
    success: colors.success,
  };

  return colorsMap[color];
};

export const TextStyled = styled(Text)<TextStyledProps>`
  font-size: ${({ size }) => size ?? 14}px;
  color: ${getTextColor};
`;
