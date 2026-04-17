import { Identicon, Text, trimAddress } from '@lidofinance/lido-ui';
import { AddressBadgeWrap, DelegatorsListItemStyled } from './style';
import { formatBalance } from 'utils/format-balance';
import { AddressPop } from 'shared/components/address-pop';
import { KnownToken } from 'shared/blockchain/tokens';

type Props = {
  address: string;
  balance: bigint;
  ensName: string | null | undefined;
};

export const DelegatorsListItem = ({ address, balance, ensName }: Props) => {
  return (
    <DelegatorsListItemStyled key={address} data-testid="delegatorsListItem">
      <AddressPop address={address}>
        <AddressBadgeWrap>
          <Identicon address={address} diameter={20} />
          <Text as="span" size="xxs" data-testid="delegatorsAddress">
            {ensName ?? trimAddress(address, 4)}
          </Text>
        </AddressBadgeWrap>
      </AddressPop>
      <Text size="xs" data-testid="delegatorsVP">
        {formatBalance(balance)} {KnownToken.LDO.symbol}
      </Text>
    </DelegatorsListItemStyled>
  );
};
