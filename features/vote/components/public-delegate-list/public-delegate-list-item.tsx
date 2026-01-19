import { ProcessedDelegate } from 'features/vote/hooks/use-processed-public-delegates-list';
import {
  DelegateInfo,
  DelegateNameAndAddress,
  DelegateNumbersMobile,
  HeaderTitleWithIcon,
  ListItem,
  SocialButtons,
} from './style';
import { Button, Text, trimAddress } from '@lidofinance/lido-ui';
import { PublicDelegateAvatar } from '../public-delegate-avatar';
import { AddressPop } from 'shared/components/address-pop';
import { ExternalLink } from 'shared/components/external-link/external-link';
import {
  AragonSmallLogo,
  LidoSocialIcon,
  XSocialIcon,
} from 'shared/components/icons';

type Props = {
  delegate: ProcessedDelegate;
  isWalletConnected: boolean;
  isMobile: boolean;
  onSelect: () => void;
};

export const PublicDelegateListItem = ({
  delegate,
  isWalletConnected,
  isMobile,
  onSelect,
}: Props) => {
  if (isMobile) {
    return (
      <ListItem>
        <DelegateInfo>
          <PublicDelegateAvatar avatarSrc={delegate.avatar} />
          <DelegateNameAndAddress>
            <Text size="xxs" weight={700} title={delegate.name}>
              {delegate.name}
            </Text>
            <AddressPop address={delegate.address}>
              <Text size="xxs" color="secondary">
                {trimAddress(delegate.address, 4)}
              </Text>
            </AddressPop>
          </DelegateNameAndAddress>
          <SocialButtons>
            <ExternalLink href={delegate.lido}>
              <LidoSocialIcon viewBox="0 0 17 16" />
            </ExternalLink>
            {delegate.twitter && (
              <ExternalLink href={delegate.twitter}>
                <XSocialIcon viewBox="0 0 17 16" />
              </ExternalLink>
            )}
          </SocialButtons>
        </DelegateInfo>
        <DelegateNumbersMobile>
          <HeaderTitleWithIcon>
            VP <AragonSmallLogo />
            {delegate.delegatedVotingPowerFormatted}
          </HeaderTitleWithIcon>
          <Text size="xxs" weight={700}>
            From {delegate.delegatorsCount.toString()}
          </Text>
        </DelegateNumbersMobile>
        {isWalletConnected && (
          <Button
            size="xs"
            variant="outlined"
            disabled={!delegate.address}
            onClick={onSelect}
          >
            Select
          </Button>
        )}
      </ListItem>
    );
  }

  return (
    <ListItem>
      <DelegateInfo>
        <PublicDelegateAvatar avatarSrc={delegate.avatar} />
        <DelegateNameAndAddress>
          <Text size="xxs" weight={700} title={delegate.name}>
            {delegate.name}
          </Text>
          <AddressPop address={delegate.address}>
            <Text size="xxs" color="secondary">
              {trimAddress(delegate.address, 4)}
            </Text>
          </AddressPop>
        </DelegateNameAndAddress>
      </DelegateInfo>
      <Text size="xxs">{delegate.delegatedVotingPowerFormatted}</Text>
      <Text size="xxs">{delegate.delegatorsCount.toString()}</Text>
      <SocialButtons>
        <ExternalLink href={delegate.lido}>
          <LidoSocialIcon />
        </ExternalLink>
        {delegate.twitter && (
          <ExternalLink href={delegate.twitter}>
            <XSocialIcon />
          </ExternalLink>
        )}
      </SocialButtons>
      {isWalletConnected && (
        <Button
          size="xs"
          variant="outlined"
          disabled={!delegate.address}
          onClick={onSelect}
        >
          Select
        </Button>
      )}
    </ListItem>
  );
};
