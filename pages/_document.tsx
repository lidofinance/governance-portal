import Document, {
  Head,
  Html,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import { createHeadersObject } from 'next-secure-headers';
import { ServerStyleSheet } from 'styled-components';
import { Fonts, LidoUIHead } from '@lidofinance/lido-ui';

import { config } from 'config';
import { contentSecurityPolicy } from 'config/csp';

const secureHeaders = createHeadersObject({ contentSecurityPolicy });
const cspMetaTagContent =
  secureHeaders['Content-Security-Policy'] ??
  secureHeaders['Content-Security-Policy-Report-Only'];

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  get metaTitle(): string {
    return 'Dual Governance | Lido';
  }

  get metaDescription(): string {
    return 'Lido Dual Governance uses a Dynamic Timelock so stETH holders can delay execution until withdrawal—enhancing protocol safety and stETH oversight.';
  }

  get metaPreviewImgUrl(): string {
    const origin = config.ipfsMode
      ? 'https://dg.lido.fi'
      : // TODO: fix type
        (config as any).selfOrigin;
    return `${origin}/dg-preview.png`;
  }

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          {config.ipfsMode && (
            <meta
              httpEquiv="Content-Security-Policy"
              content={cspMetaTagContent}
            />
          )}
          <link
            rel="manifest"
            href={`${config.BASE_PATH_ASSET}/manifest.json`}
          />
          <link
            rel="icon"
            href={`${config.BASE_PATH_ASSET}/favicon.ico`}
            sizes="any"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href={`${config.BASE_PATH_ASSET}/favicon-1080x1080.svg`}
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${config.BASE_PATH_ASSET}/apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href={`${config.BASE_PATH_ASSET}/favicon-192x192.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${config.BASE_PATH_ASSET}/favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${config.BASE_PATH_ASSET}/favicon-16x16.png`}
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={this.metaTitle} />
          <meta property="og:description" content={this.metaDescription} />
          <meta property="og:image" content={this.metaPreviewImgUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={this.metaTitle} />
          <meta name="twitter:description" content={this.metaDescription} />
          <meta name="twitter:image:src" content={this.metaPreviewImgUrl} />
          <meta name="twitter:site" content="@lidofinance" />
          <meta name="description" content={this.metaDescription} />
          <meta name="currentChain" content={String(config.defaultChain)} />
          <Fonts />
          <LidoUIHead />
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src={`${config.BASE_PATH_ASSET}/runtime/window-env.js`} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
