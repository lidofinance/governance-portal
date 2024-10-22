import { Tokens } from 'types/tokens';
import { ReactComponent as StethIcon } from 'assets/icons/tokens/steth.svg';
import { ReactComponent as WstethIcon } from 'assets/icons/tokens/wsteth.svg';
import { ReactComponent as UnstethIcon } from 'assets/icons/tokens/unsteth.svg';

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
