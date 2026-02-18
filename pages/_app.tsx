import { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AppProps } from 'next/app';
import 'nprogress/nprogress.css';
import Head from 'next/head';

import {
  ToastContainer,
  CookiesTooltip,
  migrationAllowCookieToCrossDomainCookieClientSide,
  migrationThemeCookiesToCrossDomainCookiesClientSide,
} from '@lidofinance/lido-ui';

import { config } from 'config';
import { withCsp } from 'config/csp';
import { Providers } from 'providers';
import { ErrorBoundaryFallback } from 'shared/components/error-boundary';
import { NoSsrWrapper } from 'shared/components/no-ssr-wrapper';
import { nprogress, COOKIES_ALLOWED_FULL_KEY } from 'utils';

// Migrations old theme cookies to new cross domain cookies
migrationThemeCookiesToCrossDomainCookiesClientSide();

// Migrations old allow cookies to new cross domain cookies
migrationAllowCookieToCrossDomainCookieClientSide(COOKIES_ALLOWED_FULL_KEY);

// Visualize route changes
nprogress();

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <ErrorBoundary fallbackRender={ErrorBoundaryFallback}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
};

const MemoApp = memo(App);

const AppWrapper = (
  props: AppProps<{ ___prefetch_manifest___?: object }>,
): JSX.Element => {
  return (
    <Providers prefetchedManifest={props.pageProps?.___prefetch_manifest___}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <ToastContainer />
      <MemoApp {...props} />

      <NoSsrWrapper>
        <CookiesTooltip privacyLink={`${config.rootOrigin}/privacy-notice`} />
      </NoSsrWrapper>

      {/* see https://nextjs.org/docs/messages/no-document-viewport-meta */}
    </Providers>
  );
};

export default config.ipfsMode || process.env.NODE_ENV === 'development'
  ? AppWrapper
  : withCsp(AppWrapper);
