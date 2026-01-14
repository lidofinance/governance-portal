import { Link, Loader, Text } from '@lidofinance/lido-ui';
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
import {
  DAO_OPS_FORUM_LINK,
  DELEGATORS_FETCH_TOTAL,
  DELEGATORS_PAGE_SIZE,
} from 'features/vote/constants';
import { InfoLabel } from '../info-row';
import { ExternalLink } from 'shared/components/external-link/external-link';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { Voting } from 'shared/blockchain/contracts';
import { getDaoTokenMetadata } from 'shared/blockchain/utils/get-dao-token-metadata';
import { formatBalance } from 'utils/format-balance';

export const DelegatorsList = () => {
  const { chainId } = useLidoSDK();
  const { isConnected } = useAccount();
  const [pageCount, setPageCount] = useState(1);

  const votingContractAddress = useContractAddress(Voting);

  const { data, isLoading } = useDelegators();

  const delegatorsToShow = useMemo(() => {
    if (data.nonZeroDelegators.length === 0) {
      return [];
    }

    return data.nonZeroDelegators.slice(0, pageCount * DELEGATORS_PAGE_SIZE);
  }, [data.nonZeroDelegators, pageCount]);

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

  const nonZeroDelegatorsCount = data.nonZeroDelegators.length;

  if (nonZeroDelegatorsCount === 0) {
    return (
      <Wrap $empty={true}>
        <Text size="sm" color="secondary">
          No delegated voting power
        </Text>
      </Wrap>
    );
  }

  const daoToken = getDaoTokenMetadata(chainId).symbol;

  return (
    <Wrap>
      <TitleWrap>
        <InfoLabel>Delegated</InfoLabel>
        <CounterBadge>
          {formatBalance(data.totalVotingPower)} {daoToken}
        </CounterBadge>
        <InfoLabel>
          from {nonZeroDelegatorsCount} address
          {nonZeroDelegatorsCount > 1 ? 'es' : ''} on-chain
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
        {nonZeroDelegatorsCount > pageCount * DELEGATORS_PAGE_SIZE && (
          <ShowMoreButton onClick={() => setPageCount((count) => count + 1)}>
            Show More
          </ShowMoreButton>
        )}
      </DelegatorsListStyled>
      {data.notFetchedDelegatorsCount > 0 && (
        <Text size="xxs" color="secondary">
          This list displays addresses with a positive {daoToken} balance from
          the first {DELEGATORS_FETCH_TOTAL} delegators. You have{' '}
          {data.notFetchedDelegatorsCount} more delegator
          {data.notFetchedDelegatorsCount > 1 ? 's' : ''} who were not included
          in the list. To see all your delegators, use the{' '}
          {votingContractAddress ? (
            <Link
              href={
                getEtherscanAddressLink(chainId, votingContractAddress) +
                '#readProxyContract'
              }
            >
              Voting contract
            </Link>
          ) : (
            'Voting contract'
          )}
          . If needed, contact the{' '}
          <ExternalLink href={DAO_OPS_FORUM_LINK}>DAO Ops </ExternalLink> on the
          forum for assistance.
        </Text>
      )}
    </Wrap>
  );
};
