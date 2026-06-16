import { Identicon, trimAddress } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import { InfoWrap, VoteStatus, AddressBadgeWrap } from './style';
import { VotePhase } from 'shared/votes/types';
import { AddressPop } from 'shared/components/address-pop';
import { useMemo } from 'react';
import { getPublicDelegate } from '@vote/utils/get-public-delegate';
import { PublicDelegateAvatar } from '../public-delegate-avatar';
import { useVoteContext } from '@vote/providers/vote-context';

interface Props {
  walletAddress: string | null | undefined;
}

export const VoteInfo = ({ walletAddress }: Props) => {
  const { voteEvents, vote, voterDaoTokenBalance, hasDelegated } =
    useVoteContext();
  const voteInfo = useMemo(() => {
    if (!walletAddress || !voteEvents) {
      return undefined;
    }

    // Try to find direct vote
    const voteEvent = voteEvents.find(
      (event) => event.voter.toLowerCase() === walletAddress.toLowerCase(),
    );

    if (voteEvent) {
      return { isDelegated: false, voteEvent };
    } else {
      // Try to find delegated vote
      const delegatedVote = voteEvents.find(
        (event) =>
          event.delegatedVotes?.length &&
          event.delegatedVotes?.findIndex(
            (vote) => vote.voter.toLowerCase() === walletAddress.toLowerCase(),
          ) !== -1,
      );

      if (delegatedVote) {
        return {
          isDelegated: true,
          voteEvent: delegatedVote,
        };
      }
    }

    return null;
  }, [walletAddress, voteEvents]);

  if (voteInfo === undefined) {
    return null;
  }

  if (voteInfo === null) {
    if (hasDelegated) {
      return (
        <InfoWrap>
          <Text size={12} color="secondary">
            {vote.phase === VotePhase.Closed
              ? 'Delegate did not vote'
              : 'Delegate not voted yet'}
          </Text>
        </InfoWrap>
      );
    }

    // If no balance at snapshot block, show nothing
    if (!voterDaoTokenBalance) {
      return null;
    }

    return (
      <InfoWrap>
        <Text size={12} color="secondary">
          {vote.phase === VotePhase.Closed
            ? 'You did not vote'
            : 'You have not voted yet'}
        </Text>
      </InfoWrap>
    );
  }

  const { voteEvent, isDelegated } = voteInfo;

  if (isDelegated) {
    const publicDelegate = getPublicDelegate(voteEvent.voter);

    return (
      <InfoWrap>
        <Text size={12} color="secondary">
          Delegate
        </Text>
        <AddressPop address={voteEvent.voter}>
          <AddressBadgeWrap>
            {publicDelegate ? (
              <PublicDelegateAvatar
                avatarSrc={publicDelegate.avatar}
                size={20}
              />
            ) : (
              <Identicon address={voteEvent.voter} diameter={20} />
            )}
            <Text
              as="span"
              size={12}
              color={publicDelegate ? 'default' : 'secondary'}
            >
              {publicDelegate?.name ?? trimAddress(voteEvent.voter, 4)}
            </Text>
          </AddressBadgeWrap>
        </AddressPop>
        <Text size={12} color="secondary">
          voted
        </Text>
        <VoteStatus $supports={voteEvent.supports}>
          <Text size={12} color="secondary">
            for
          </Text>
          <Text as="span" size={12} strong>
            {voteEvent.supports ? '“Yes”' : '“No”'}
          </Text>
        </VoteStatus>
      </InfoWrap>
    );
  }

  return (
    <InfoWrap>
      <Text size={12} color="secondary">
        You voted
      </Text>
      <VoteStatus $supports={voteEvent.supports}>
        <Text size={12} color="secondary">
          for
        </Text>
        <Text as="span" size={12} strong>
          {voteEvent.supports ? '“Yes”' : '“No”'}
        </Text>
      </VoteStatus>
    </InfoWrap>
  );
};
