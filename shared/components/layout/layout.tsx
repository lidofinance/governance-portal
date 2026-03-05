import { FC, PropsWithChildren } from 'react';
import Head from 'next/head';

import { ContainerProps } from '@lidofinance/lido-ui';

import { Header } from './header/header';
import { Footer } from './footer/footer';
import {
  LayoutTitleStyle,
  LayoutSubTitleStyle,
  ContainerStyled,
} from './style';

type Props = {
  title?: string | null;
  subtitle?: string | null;
  containerSize?: ContainerProps['size'];
  metaTitle?: string;
};

export const Layout: FC<PropsWithChildren<Props>> = (props) => {
  const {
    title,
    subtitle,
    containerSize = 'tight',
    metaTitle: metaTitleProp,
  } = props;
  const { children } = props;

  return (
    <>
      <Head>
        <title>{metaTitleProp ?? title ?? 'Governance Portal'} | Lido</title>
      </Head>
      <Header />
      <ContainerStyled size={containerSize}>
        <LayoutTitleStyle>{title}</LayoutTitleStyle>
        <LayoutSubTitleStyle>{subtitle}</LayoutSubTitleStyle>
        {children}
      </ContainerStyled>
      <Footer />
    </>
  );
};
