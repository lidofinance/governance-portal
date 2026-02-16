import { ReactNode, FC, PropsWithChildren } from 'react';
import Head from 'next/head';

import { ContainerProps } from '@lidofinance/lido-ui';

import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Main } from './main/main';
import { LayoutTitleStyle, LayoutSubTitleStyle } from './style';

const DEFAULT_PAGE_TITLE = 'Lido Governance';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  containerSize?: ContainerProps['size'];
  pageTitle?: string;
};

export const Layout: FC<PropsWithChildren<Props>> = (props) => {
  const {
    title,
    subtitle,
    containerSize,
    pageTitle = 'Governance Portal | Lido',
  } = props;
  const { children } = props;

  return (
    <>
      <Head>
        <title>
          {pageTitle
            ? `${pageTitle} | ${DEFAULT_PAGE_TITLE}`
            : DEFAULT_PAGE_TITLE}
        </title>
      </Head>
      <Header />
      <Main size={containerSize}>
        <LayoutTitleStyle>{title}</LayoutTitleStyle>
        <LayoutSubTitleStyle>{subtitle}</LayoutSubTitleStyle>
        {children}
      </Main>
      <Footer />
    </>
  );
};
