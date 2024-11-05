import { FC } from 'react';
import { TextStyled, TextProps } from './style';

// Restyled version of the Text component from the lido-ui library
export const Text: FC<TextProps> = (props) => {
  return <TextStyled {...props} size={props.size || 17} />;
};
