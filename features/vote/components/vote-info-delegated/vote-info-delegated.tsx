import { Identicon, trimAddress } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import { InfoWrap, VoteStatus, AddressBadgeWrap } from './style';
import { VoteEvent } from 'shared/votes/types';
import { AddressPop } from 'shared/components/address-pop';
import { useMemo } from 'react';
import { getPublicDelegate } from 'features/vote/utils/get-public-delegate';
import { PublicDelegateAvatar } from '../public-delegate-avatar';

interface Props {
  walletAddress: string | null | undefined;
  voteEvents: VoteEvent[];
}

export const VoteInfoDelegated = ({ walletAddress, voteEvents }: Props) => {
  const delegateVoteInfo = useMemo(() => {
    if (!walletAddress || !voteEvents) {
      return null;
    }

    return voteEvents.find(
      (event) =>
        event.delegatedVotes?.length &&
        event.delegatedVotes.findIndex(
          (vote) => vote.voter.toLowerCase() === walletAddress.toLowerCase(),
        ) !== -1,
    );
  }, [walletAddress, voteEvents]);

  if (!delegateVoteInfo) {
    return null;
  }

  const publicDelegate = getPublicDelegate(delegateVoteInfo.voter);

  return (
    <InfoWrap>
      <Text size={12} color="secondary">
        Delegate
      </Text>
      <AddressPop address={delegateVoteInfo.voter}>
        <AddressBadgeWrap>
          {publicDelegate ? (
            <PublicDelegateAvatar avatarSrc={publicDelegate.avatar} size={20} />
          ) : (
            <Identicon address={delegateVoteInfo.voter} diameter={20} />
          )}
          <Text
            as="span"
            size={12}
            color={publicDelegate ? 'default' : 'secondary'}
          >
            {publicDelegate?.name ?? trimAddress(delegateVoteInfo.voter, 4)}
          </Text>
        </AddressBadgeWrap>
      </AddressPop>
      <Text size={12} color="secondary">
        voted
      </Text>
      <VoteStatus $supports={delegateVoteInfo.supports}>
        <Text size={12} color="secondary">
          for
        </Text>
        <Text as="span" size={12} strong>
          {delegateVoteInfo.supports ? '“Yes”' : '“No”'}
        </Text>
      </VoteStatus>
    </InfoWrap>
  );
};
