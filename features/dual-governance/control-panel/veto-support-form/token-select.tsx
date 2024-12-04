import { Text } from 'shared/components/text';
import { TokenSelectStyled } from './style';
import { Tabs, Tab } from 'shared/components/tabs';
import { Token } from 'shared/blockchain/types';
import { useSupportFormDataContext } from './support-form-context';
import { TokenBalance } from 'shared/components/token-balance';
import { useFormContext } from 'react-hook-form';
import { VetoSupportedTokens } from 'features/dual-governance/types';
import { useCallback } from 'react';

export const TokenSelect = () => {
  const { networkData, selectedToken } = useSupportFormDataContext();

  const { register } = useFormContext();

  const getTokenBalance = useCallback(
    (token: VetoSupportedTokens) => {
      switch (token) {
        case Token.stETH:
          return networkData.stEthBalance;
        case Token.wstETH:
          return networkData.wstEthBalance;
        case Token.unstETH:
          return networkData.wstEthBalance;
      }
    },
    [networkData.stEthBalance, networkData.wstEthBalance],
  );

  return (
    <TokenSelectStyled>
      <Text>Select a token to add to the VetoSignalling contract</Text>
      <Tabs>
        {VetoSupportedTokens.map((token) => (
          <Tab key={token} isActive={selectedToken === token}>
            <label>
              <input
                type="radio"
                {...register('token')}
                value={token}
                disabled={token === Token.unstETH}
              />
              <TokenBalance
                token={token}
                variant="compact"
                balance={getTokenBalance(token)}
              />
            </label>
          </Tab>
        ))}
      </Tabs>
    </TokenSelectStyled>
  );
};
