import { FC, forwardRef } from 'react';
import { TextStyled, TextProps } from './style';

type Props = Omit<TextProps, 'color'> & {
  color?: TextProps['color'] | 'accent';
};

// Restyled version of the Text component from the lido-ui library
export const Text: FC<Props> = forwardRef((props, ref) => {
  return <TextStyled {...props} size={props.size || 17} ref={ref} />;
});
