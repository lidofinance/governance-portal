import { ChipWrap } from './style';
import { ChipVariant } from './types';

interface Props {
  children?: any;
  variant: ChipVariant;
}

export const Chip = ({ children, variant }: Props) => {
  return <ChipWrap $variant={variant}>{children}</ChipWrap>;
};
