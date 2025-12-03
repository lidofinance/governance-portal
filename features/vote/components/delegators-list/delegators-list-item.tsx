import { Identicon, Text, trimAddress } from '@lidofinance/lido-ui';
import { AddressBadgeWrap, DelegatorsListItemStyled } from './style';
import { formatBalance } from 'utils/format-balance';
import { AddressPop } from 'shared/components/address-pop';

type Props = {
  address: string;
  balance: bigint;
  ensName: string | null | undefined;
  governanceSymbol: string | undefined;
};

export const DelegatorsListItem = ({
  address,
  balance,
  governanceSymbol,
  ensName,
}: Props) => {
  return (
    <DelegatorsListItemStyled key={address}>
      <AddressPop address={address}>
        <AddressBadgeWrap>
          <Identicon address={address} diameter={20} />
          <Text as="span" size="xxs">
            {ensName ?? trimAddress(address, 6)}
          </Text>
        </AddressBadgeWrap>
      </AddressPop>
      <Text size="xs">
        {formatBalance(balance)} {governanceSymbol ?? ''}
      </Text>
    </DelegatorsListItemStyled>
  );
};
