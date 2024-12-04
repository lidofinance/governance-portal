import { useDualGovernanceContext } from 'providers/dual-governance';
import GlobalStyle from './global';

export const GlobalStyleOverwrite = () => {
  const { visibleState } = useDualGovernanceContext();

  return <GlobalStyle $layoutVariant={visibleState} />;
};
