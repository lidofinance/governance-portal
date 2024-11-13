import { Text } from 'shared/components/text';
import { TokenSelectStyled } from './style';
import { Tabs, Tab } from 'shared/components/tabs';
import { Token } from 'shared/blockchain/types';
import { useSupportFormDataContext } from './support-form-context';
import { TokenBalance } from 'shared/components/token-balance';

export const TokenSelect = () => {
  const { networkData, activeToken, setActiveToken } =
    useSupportFormDataContext();

  return (
    <TokenSelectStyled>
      <Text>Select a token to add to the VetoSignaling contract</Text>
      <Tabs>
        <Tab
          isActive={activeToken === Token.stETH}
          onClick={() => setActiveToken(Token.stETH)}
        >
          <TokenBalance
            token={Token.stETH}
            variant="compact"
            balance={networkData.stEthBalance}
          />
        </Tab>
        <Tab
          isActive={activeToken === Token.wstETH}
          onClick={() => setActiveToken(Token.wstETH)}
        >
          <TokenBalance
            token={Token.wstETH}
            variant="compact"
            balance={networkData.wstEthBalance}
          />
        </Tab>
        <Tab
          isActive={activeToken === Token.unstETH}
          disabled
          onClick={() => setActiveToken(Token.unstETH)}
        >
          <TokenBalance
            token={Token.unstETH}
            variant="compact"
            balance={networkData.wstEthBalance}
          />
        </Tab>
      </Tabs>
    </TokenSelectStyled>
  );
};
