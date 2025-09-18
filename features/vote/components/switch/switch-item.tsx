import { FC, ReactNode, useMemo } from 'react';
import { SwitchItemStyled } from './style';
import { useRouter } from 'next/router';
import { compareWithRouterPathInInfra } from 'utils/compare-with-router-path';

type ComponentProps<
  T extends keyof JSX.IntrinsicElements,
  P extends Record<string, unknown> = { children?: ReactNode },
> = Omit<JSX.IntrinsicElements[T], 'key' | keyof P> & P;

type Component<
  T extends keyof JSX.IntrinsicElements,
  P extends Record<string, unknown> = { children?: ReactNode },
> = FC<ComponentProps<T, P>>;

export const SwitchItem: Component<'a'> = (props) => {
  const { href, ...rest } = props;
  const router = useRouter();

  const active = useMemo(
    () => compareWithRouterPathInInfra(router.asPath, href ?? ''),
    [router.asPath, href],
  );

  return <SwitchItemStyled href={href ?? ''} $active={active} {...rest} />;
};
