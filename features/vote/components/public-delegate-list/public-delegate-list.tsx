import { Loader, Text, Tooltip, useBreakpoint } from '@lidofinance/lido-ui';
import { Header, HeaderTitleWithIcon, InnerWrap, Wrap } from './style';
import { PublicDelegateListItem } from './public-delegate-list-item';
import { useAccount } from 'wagmi';
import { AragonSmallLogo } from 'shared/components/icons';
import { useProcessedPublicDelegatesList } from 'features/vote/hooks/use-processed-public-delegates-list';

export const PublicDelegateList = () => {
  const { isConnected } = useAccount();
  const isMobile = useBreakpoint('md');

  const { data, isLoading } = useProcessedPublicDelegatesList();

  if (!data || isLoading) {
    return (
      <Wrap>
        <Loader />
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Text size={isMobile ? 'xs' : 'md'} weight={700}>
        Public Delegate List
      </Text>
      <InnerWrap $connected={isConnected}>
        {!isMobile && (
          <Header>
            <Text size="xxs" weight={700}>
              Delegate
            </Text>
            <Tooltip placement="top" title="Voting Power">
              <HeaderTitleWithIcon>
                VP <AragonSmallLogo />
              </HeaderTitleWithIcon>
            </Tooltip>
            <Tooltip
              placement="top"
              title="Number of addresses that have delegated to this delegate"
            >
              <Text size="xxs" weight={700}>
                From
              </Text>
            </Tooltip>
            <p />
            <p />
          </Header>
        )}
        {data.map((delegate) => (
          <PublicDelegateListItem
            key={delegate.address}
            delegate={delegate}
            isWalletConnected={isConnected}
            isMobile={isMobile}
          />
        ))}
      </InnerWrap>
    </Wrap>
  );
};
