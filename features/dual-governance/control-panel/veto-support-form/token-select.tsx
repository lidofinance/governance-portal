import { Text } from 'shared/components/text';
import { TokenSelectLabel, TokenSelectStyled } from './style';
import { Tabs, Tab } from 'shared/components/tabs';
import { Token } from 'shared/blockchain/types';
import { useSupportFormDataContext } from './support-form-context';
import { TokenBalance } from 'shared/components/token-balance';
import { useFormContext } from 'react-hook-form';
import { VetoSupportedTokens } from '@dg/types';
import { useCallback } from 'react';
import { useEscrowContext } from 'providers/escrow';
import { getEtherscanAddressLink } from 'utils/etherscan';
import Link from 'next/link';
import { useLidoSDK } from 'providers/lido-sdk';
import { ExternalLinkIcon } from 'shared/components/icons';

export const TokenSelect = () => {
  const { networkData, selectedToken } = useSupportFormDataContext();

  const { chainId } = useLidoSDK();

  const { vetoSignallingAddress } = useEscrowContext();

  const { register } = useFormContext();

  const getTokenBalance = useCallback(
    (token: VetoSupportedTokens) => {
      switch (token) {
        case Token.stETH:
          return networkData.stEthBalance;
        case Token.wstETH:
          return networkData.wstEthBalance;
        case Token.unstETH:
          return networkData.unstEthBalance;
      }
    },
    [
      networkData.stEthBalance,
      networkData.wstEthBalance,
      networkData.unstEthBalance,
    ],
  );

  return (
    <TokenSelectStyled>
      <Text color="primary">
        Select a token to add to the VetoSignalling{' '}
        {vetoSignallingAddress ? (
          <Link
            target="_blank"
            href={getEtherscanAddressLink(chainId, vetoSignallingAddress)}
          >
            {'contract '}
            <ExternalLinkIcon />
          </Link>
        ) : (
          'contract'
        )}
      </Text>
      <Tabs>
        {VetoSupportedTokens.map((token) => (
          <Tab key={token} isActive={selectedToken === token}>
            <TokenSelectLabel>
              <input type="radio" {...register('token')} value={token} />
              <TokenBalance
                token={token}
                variant="compact"
                balance={getTokenBalance(token)}
              />
            </TokenSelectLabel>
          </Tab>
        ))}
      </Tabs>
    </TokenSelectStyled>
  );
};
