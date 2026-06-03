import { Identicon, Link, Text, trimAddress } from '@lidofinance/lido-ui';

import { REGEX_URL } from './regex-url';
import { REGEX_ETH_ADDRESS } from './regex-eth-address';
import { REGEX_CID, REGEX_CID_CUTER } from './regex-cid';
import { replaceRegexWithJSX } from './replace-regex-with-JSX';
import { getIpfsUrl } from './get-ipfs-url';
import { AddressPop } from '../shared/components/address-pop';
import { Box } from '../shared/components/box';
import { ExternalLink } from '../shared/components/external-link/external-link';

export const replaceJsxElements = (text: string) => {
  return replaceRegexWithJSX(text, [
    {
      regex: REGEX_URL,
      replace: (link) => <ExternalLink href={link}>{link}</ExternalLink>,
    },
    {
      regex: REGEX_ETH_ADDRESS,
      replace: (address) => (
        <AddressPop address={address} isInline>
          <Box
            display="inline-flex"
            alignItems="center"
            background="#EFF2F6"
            borderRadius={10}
            padding="0px 8px 0px 3px;"
            gap={4}
          >
            <Identicon address={address} diameter={16} />
            <Text style={{ cursor: 'pointer' }} size="xxs">
              {trimAddress(address, 4)}
            </Text>
          </Box>
        </AddressPop>
      ),
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
