import { Address as AddressUI, Link } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import type { Address } from 'viem';

import {
  AragonLogo,
  ProposalsIcon,
  WarningIcon,
} from 'shared/components/icons';
import { LogoWrapper, Title, TitleWrapper, WarningIconWrapper } from './style';
import { FlexWrapper } from 'shared/styled-components';
import { getEtherscanAddressLink } from 'utils/etherscan';

type Props = {
  warning?: boolean;
  id: number;
  isAragon?: boolean;
  isUnknownContractCalled?: boolean;
  proposer?: Address;
  chainId: number;
};

export const ProposalName = ({
  id,
  warning,
  isAragon,
  proposer,
  chainId,
}: Props) => {
  return (
    <>
      <TitleWrapper onClick={(e) => e.stopPropagation()}>
        {warning ? (
          <WarningIconWrapper>
            <WarningIcon />
          </WarningIconWrapper>
        ) : (
          <LogoWrapper $hasOffset={!isAragon}>
            {isAragon ? <AragonLogo /> : <ProposalsIcon />}
          </LogoWrapper>
        )}

        <FlexWrapper $flexDirection="column" $alignItems="flex-start">
          <Title>{isAragon ? `Vote #${id}` : `Proposal #${id}`}</Title>
          {proposer && (
            <Text size={14} color="secondary">
              by{' '}
              <Link href={getEtherscanAddressLink(chainId, proposer)}>
                <AddressUI as="span" address={proposer} />
              </Link>
            </Text>
          )}
          {isAragon && <Text size={14}>Ongoing Aragon vote</Text>}
        </FlexWrapper>
      </TitleWrapper>
    </>
  );
};
