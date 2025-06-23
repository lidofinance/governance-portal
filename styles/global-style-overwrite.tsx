import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import GlobalStyle from './global';

export const GlobalStyleOverwrite = () => {
  const { visibleState } = useDualGovernanceStateContext();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return <GlobalStyle $layoutVariant={visibleState} />;
};
