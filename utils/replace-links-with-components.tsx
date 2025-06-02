import { Link } from '@lidofinance/lido-ui';

import { AddressBadge } from '../shared/wallet/address-badge/address-badge';
import { REGEX_URL } from './regex-url';
import { REGEX_ETH_ADDRESS } from './regex-eth-address';
import { REGEX_CID, REGEX_CID_CUTER } from './regex-cid';
import { replaceRegexWithJSX } from './replace-regex-with-JSX';
import { getIpfsUrl } from './get-ipfs-url';

export const replaceJsxElements = (text: string) => {
  return replaceRegexWithJSX(text, [
    {
      regex: REGEX_URL,
      replace: (link) => <Link href={link}>{link}</Link>,
    },
    {
      regex: REGEX_ETH_ADDRESS,
      replace: (address) => <AddressBadge address={address} />,
    },
    {
      regex: REGEX_CID,
      replace: (cid) => (
        <Link href={getIpfsUrl(cid)}>
          {cid.replace(REGEX_CID_CUTER, '$1..$2')}
        </Link>
      ),
    },
  ]);
};
