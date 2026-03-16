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
        <title>{`${metaTitleProp ?? title ?? 'Governance Portal'} | Lido`}</title>
        <meta
          name="description"
          content="Lido Governance Portal: follow Lido DAO governance, votes, decisions, on-chain voting, Aragon proposals, and Dual Governance."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${metaTitleProp ?? title ?? 'Governance Portal'} | Lido`}
        />
        <meta
          property="og:description"
          content="Lido Governance Portal: follow Lido DAO governance, votes, decisions, on-chain voting, Aragon proposals, and Dual Governance."
        />
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
