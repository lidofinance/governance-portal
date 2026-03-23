import { useState } from 'react';
import { AddressLabel, AddressWrap, ListRow, ListRowCell } from './style';
import {
  ArrowBottom,
  Identicon,
  Text,
  Tooltip,
  trimAddress,
} from '@lidofinance/lido-ui';
import { VoteEvent } from 'shared/votes/types';
import { AddressPop } from 'shared/components/address-pop/address-pop';
import { parseEther } from 'viem';
import { PublicDelegateAvatar } from '../public-delegate-avatar';
import { TurnArrow, UnionIcon } from 'shared/components/icons';
import { getPublicDelegate } from '../../utils/get-public-delegate';
import { formatVp } from 'features/vote/utils/format-vp';

const getShouldShowTooltip = (stake: bigint) => {
  return stake > parseEther('1000') || stake < parseEther('0.1');
};

type Props = {
  voteEvent: VoteEvent;
  ensMap: Record<string, string | null> | undefined;
  walletAddress: string | undefined;
  isMobile: boolean;
  isDelegated?: boolean;
};

export const VoterItem = ({
  voteEvent,
  ensMap,
  walletAddress,
  isDelegated,
  isMobile,
}: Props) => {
  const [isDelegatorsListVisible, setIsDelegatorsListVisible] = useState(false);

  const { voter, delegatedVotes, supports, stake } = voteEvent;

  const delegatedVotesLength = delegatedVotes?.length || 0;
  const isDelegate = delegatedVotesLength > 0;

  const publicDelegate = getPublicDelegate(voter);

  const handleExpandClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isDelegate) {
      setIsDelegatorsListVisible(!isDelegatorsListVisible);
    }
  };

  const vpElement = (
    <Text weight={isDelegate ? 700 : 400} size="xxs" data-testid="votingPower">
      {formatVp({ stake, showSymbol: !isMobile })}
    </Text>
  );

  return (
    <>
      <ListRow
        data-testid="votersRow"
        $isDelegate={isDelegate}
        $isExpanded={isDelegatorsListVisible}
        $isDelegated={isDelegated}
        onClick={handleExpandClick}
      >
        <ListRowCell>
          <AddressPop address={voter} isPaddingless>
            <AddressWrap data-testid="voterAddress">
              {isDelegated && <TurnArrow />}
              {publicDelegate ? (
                <>
                  <PublicDelegateAvatar
                    avatarSrc={publicDelegate.avatar}
                    size={20}
                  />
                  {publicDelegate.name}
                </>
              ) : (
                <>
                  <Identicon address={voter} diameter={20} />
                  <AddressLabel>
                    {ensMap?.[voter] ?? trimAddress(voter, 4)}
                  </AddressLabel>
                </>
              )}
              {(isDelegate || isDelegated) && <UnionIcon />}
            </AddressWrap>
          </AddressPop>
        </ListRowCell>
        <ListRowCell data-testid="voteStats">
          {supports ? 'Yes' : 'No'}{' '}
          {voter.toLowerCase() === walletAddress?.toLowerCase() ? `(You)` : ''}{' '}
          {isDelegate && `(${delegatedVotesLength})`}
        </ListRowCell>
        <ListRowCell>
          {getShouldShowTooltip(stake) ? (
            <Tooltip
              placement="top"
              title={formatVp({ stake, showFullValue: true })}
            >
              {vpElement}
            </Tooltip>
          ) : (
            vpElement
          )}
          {isDelegate && <ArrowBottom width={20} height={20} color="#7A8AA0" />}
        </ListRowCell>
      </ListRow>
      {isDelegatorsListVisible &&
        delegatedVotes?.map((vote) => (
          <VoterItem
            key={vote.voter}
            voteEvent={vote}
            ensMap={ensMap}
            isMobile={isMobile}
            walletAddress={walletAddress}
            isDelegated={true}
          />
        ))}
    </>
  );
};
