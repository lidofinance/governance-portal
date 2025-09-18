import { Identicon, Text, trimAddress } from '@lidofinance/lido-ui';
import { AddressBadgeWrap, DelegatorsListItemStyled } from './style';
import { formatNumber } from 'shared/blockchain/utils';

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
      <AddressBadgeWrap>
        <Identicon address={address} diameter={20} />
        <Text as="span" size="xxs">
          {ensName ?? trimAddress(address, 6)}
        </Text>
      </AddressBadgeWrap>
      <Text size="xs">
        {formatNumber({ value: balance })} {governanceSymbol ?? ''}
      </Text>
    </DelegatorsListItemStyled>
  );
};
