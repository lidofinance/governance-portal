import { FC, forwardRef } from 'react';
import { TextStyled, TextProps } from './style';

// Restyled version of the Text component from the lido-ui library
export const Text: FC<TextProps> = forwardRef((props, ref) => {
  return <TextStyled {...props} size={props.size || 17} ref={ref} />;
});
