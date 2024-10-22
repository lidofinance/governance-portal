import { config } from 'config';
import { DualGovernancePage } from 'features/dual-governance';
import { HomePageIpfs } from 'features/ipfs';

import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

export const getStaticProps = getDefaultStaticProps();

export default config.ipfsMode ? HomePageIpfs : DualGovernancePage;
