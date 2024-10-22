import { Tokens } from 'types/tokens';
import { StethIcon, WstethIcon, UnstethIcon } from 'shared/components/icons';

export const iconsDict = {
  [Tokens.STETH]: <StethIcon />,
  [Tokens.WSTETH]: <WstethIcon />,
  [Tokens.UNSTETH]: <UnstethIcon />,
};

export const tokensSymbolDict = {
  [Tokens.STETH]: 'stETH',
  [Tokens.WSTETH]: 'wstETH',
  [Tokens.UNSTETH]: 'unstETH',
};
