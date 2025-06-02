import { FC } from 'react';
import buildInfo from 'build-info.json';
import { config } from 'config';

import {
  FooterBorderWrapper,
  FooterStyle,
  FooterLink,
  LogoLidoStyle,
  Version,
  LinkDivider,
} from './styles';

const getVersionInfo = () => {
  const { version, branch } = buildInfo;
  const repoBaseUrl = 'https://github.com/lidofinance/ethereum-staking-widget';
  if (version === 'REPLACE_WITH_VERSION')
    return {
      label: 'dev',
      link: repoBaseUrl,
    };
  if (version === branch + ':-unknown')
    return {
      label: 'preview',
      link: `${repoBaseUrl}/tree/${branch}`,
    };
  if (version === 'staging' || version === 'dev') {
    return {
      label: version,
      link: `${repoBaseUrl}/tree/${branch}`,
    };
  }
  return {
    label: `v${version}`,
    link: `${repoBaseUrl}/releases/tag/${version}`,
  };
};

const { label, link } = getVersionInfo();

export const Footer: FC = () => {
  return (
    <FooterBorderWrapper>
      <FooterStyle size="full" forwardedAs="footer">
        <LogoLidoStyle />
        <FooterLink
          data-testid="termsOfUse"
          href={`${config.rootOrigin}/terms-of-use`}
        >
          Terms of Use
        </FooterLink>
        <LinkDivider />
        <FooterLink
          data-testid="privacyNotice"
          href={`${config.rootOrigin}/privacy-notice`}
        >
          Privacy Notice
        </FooterLink>
        <LinkDivider />
        {/*<FooterLink*/}
        {/*  data-testid="privacyNotice"*/}
        {/*  href={`${config.selfOrigin}/committee`}*/}
        {/*  $marginRight="auto"*/}
        {/*>*/}
        {/*  Tiebreaker committee*/}
        {/*</FooterLink>*/}
        <Version data-testid="appVersion" href={link}>
          {label}
        </Version>
      </FooterStyle>
    </FooterBorderWrapper>
  );
};
