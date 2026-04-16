import { Identicon, Text, trimAddress } from '@lidofinance/lido-ui';
import {
  AddressBadgeWrap,
  RevokeDelegationButton,
  DelegationAddressBadgeStyled,
} from './style';
import { DelegationType, PublicDelegate } from '@vote/types';
import { useDelegationFormData } from '@vote/providers/delegation-form-context';
import { AddressPop } from 'shared/components/address-pop';
import { PublicDelegateAvatar } from '@vote/components/public-delegate-avatar';

type Props = {
  address: string;
  publicDelegate: PublicDelegate | null | undefined;
  type: DelegationType;
};

export const DelegationAddressBadge = ({
  address,
  publicDelegate,
  type,
}: Props) => {
  const { onRevoke } = useDelegationFormData();

  return (
    <DelegationAddressBadgeStyled>
      <AddressPop address={address}>
        <AddressBadgeWrap data-testid="delegateBadge">
          {publicDelegate ? (
            <PublicDelegateAvatar avatarSrc={publicDelegate.avatar} size={20} />
          ) : (
            <Identicon address={address} diameter={20} />
          )}
          <Text
            as="span"
            size="xxs"
            color={publicDelegate ? 'default' : 'secondary'}
            data-testid="currentDelegate"
          >
            {publicDelegate?.name ?? trimAddress(address, 4)}
          </Text>
        </AddressBadgeWrap>
      </AddressPop>
      <RevokeDelegationButton
        onClick={() => onRevoke(type)}
        data-testid="revokeButton"
      />
    </DelegationAddressBadgeStyled>
  );
};
