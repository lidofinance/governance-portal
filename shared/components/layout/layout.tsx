import { FC, PropsWithChildren } from 'react';
import Head from 'next/head';

import { ContainerProps } from '@lidofinance/lido-ui';

import { Header } from './header/header';
import { Footer } from './footer/footer';
import { TestModeBanner } from 'shared/components/test-mode-banner';
import { NoSsrWrapper } from 'shared/components/no-ssr-wrapper';
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

const META_DESCRIPTION =
  'Lido Governance Portal: follow Lido DAO governance, votes, decisions, on-chain voting, Aragon proposals, and Dual Governance.';

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
        <meta name="description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${metaTitleProp ?? title ?? 'Governance Portal'} | Lido`}
        />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@lidofinance" />
        <meta
          name="twitter:title"
          content={`${metaTitleProp ?? title ?? 'Governance Portal'} | Lido`}
        />
        <meta name="twitter:description" content={META_DESCRIPTION} />
      </Head>
      <Header />
      <NoSsrWrapper>
        <TestModeBanner />
      </NoSsrWrapper>
      <ContainerStyled size={containerSize}>
        {title && <LayoutTitleStyle>{title}</LayoutTitleStyle>}
        {subtitle && <LayoutSubTitleStyle>{subtitle}</LayoutSubTitleStyle>}
        {children}
      </ContainerStyled>
      <Footer />
    </>
  );
};
