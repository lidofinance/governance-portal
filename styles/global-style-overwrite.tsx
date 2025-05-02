import { useDualGovernanceContext } from 'providers/dual-governance';
import GlobalStyle from './global';

export const GlobalStyleOverwrite = () => {
  const { visibleState } = useDualGovernanceContext();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return <GlobalStyle $layoutVariant={visibleState} />;
};
