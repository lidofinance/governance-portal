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
import { formatEth } from 'shared/blockchain/utils';
import { PublicDelegateAvatar } from '../public-delegate-avatar';
import { TurnArrow, UnionIcon } from 'shared/components/icons';
import { getPublicDelegate } from '../../utils/get-public-delegate';
import { formatBalance } from 'utils/format-balance';

type Props = {
  voteEvent: VoteEvent;
  governanceTokenSymbol: string;
  ensMap: Record<string, string | null> | undefined;
  isMobile: boolean;
  isDelegated?: boolean;
};

export const VoterItem = ({
  voteEvent,
  governanceTokenSymbol,
  ensMap,
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
      {formatBalance(stake, 1)} {isMobile ? '' : governanceTokenSymbol}
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
          {supports ? 'Yes' : 'No'} {isDelegate && `(${delegatedVotesLength})`}
        </ListRowCell>
        <ListRowCell>
          {Number(stake) > parseEther('1000') ? (
            <Tooltip placement="top" title={formatEth(stake)}>
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
            governanceTokenSymbol={governanceTokenSymbol}
            ensMap={ensMap}
            isMobile={isMobile}
            isDelegated={true}
          />
        ))}
    </>
  );
};
