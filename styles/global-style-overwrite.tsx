import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import GlobalStyle from './global';
import { useRouter } from 'next/router';

// We use the same gray background for voting and easy-track, DG is getting color based on the DG status
export const GlobalStyleOverwrite = () => {
  const { visibleState } = useDualGovernanceStateContext();
  let layoutVariant;

  const { asPath } = useRouter();

  if (asPath.startsWith('/governance')) {
    layoutVariant = visibleState;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return <GlobalStyle $layoutVariant={layoutVariant} />;
};
