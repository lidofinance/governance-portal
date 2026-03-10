import { Loader, Text } from '@lidofinance/lido-ui';
import { useMemo, useState } from 'react';
import {
  CounterBadge,
  DelegatorsListStyled,
  LoadingWrap,
  ShowMoreButton,
  TitleWrap,
  Wrap,
} from './style';
import { DelegatorsListItem } from './delegators-list-item';
import { useAccount } from 'wagmi';
import { useLidoSDK } from 'providers/lido-sdk';
import { useDelegators } from 'features/vote/hooks/use-delegators';
import { DELEGATORS_PAGE_SIZE } from 'features/vote/constants';
import { InfoLabel } from '../info-row';
import { getDaoTokenMetadata } from 'shared/blockchain/utils/get-dao-token-metadata';
import { formatBalance } from 'utils/format-balance';

export const DelegatorsList = () => {
  const { chainId } = useLidoSDK();
  const { isConnected } = useAccount();
  const [pageCount, setPageCount] = useState(1);

  const { data, isLoading } = useDelegators();

  const delegatorsToShow = useMemo(() => {
    if (!data?.delegatedVoters.length) {
      return [];
    }

    return data.delegatedVoters.slice(0, pageCount * DELEGATORS_PAGE_SIZE);
  }, [data?.delegatedVoters, pageCount]);

  if (!isConnected) {
    return (
      <Wrap $empty={true}>
        <Text size="sm" color="secondary">
          Connect wallet to see your delegators
        </Text>
      </Wrap>
    );
  }

  if (isLoading) {
    return (
      <LoadingWrap>
        <Loader />
      </LoadingWrap>
    );
  }

  if (!data?.totalDelegatedVotingPower) {
    return (
      <Wrap $empty={true}>
        <Text size="sm" color="secondary">
          No delegated voting power
        </Text>
      </Wrap>
    );
  }

  const daoToken = getDaoTokenMetadata(chainId).symbol;
  const delegatedVotersCount = data.delegatedVoters.length;

  return (
    <Wrap>
      <TitleWrap>
        <InfoLabel>Delegated</InfoLabel>
        <CounterBadge>
          {formatBalance(data.totalDelegatedVotingPower)} {daoToken}
        </CounterBadge>
        <InfoLabel>
          from {delegatedVotersCount} address
          {delegatedVotersCount > 1 ? 'es' : ''} on-chain
        </InfoLabel>
      </TitleWrap>
      <DelegatorsListStyled>
        {delegatorsToShow.map((delegator) => (
          <DelegatorsListItem
            key={delegator.address}
            address={delegator.address}
            balance={delegator.balance}
            ensName={delegator.ensName}
            governanceSymbol={daoToken}
          />
        ))}
        {delegatedVotersCount > pageCount * DELEGATORS_PAGE_SIZE && (
          <ShowMoreButton onClick={() => setPageCount((count) => count + 1)}>
            Show More
          </ShowMoreButton>
        )}
      </DelegatorsListStyled>
    </Wrap>
  );
};
