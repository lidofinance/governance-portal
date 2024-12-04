import { Text } from '@lidofinance/lido-ui';

import {
  AragonLogo,
  ProposalsIcon,
  WarningIcon,
} from 'shared/components/icons';
import {
  LogoWrapper,
  Title,
  TitleWrapper,
  UnknownContract,
  WarningIconWrapper,
} from './style';
import { FlexWrapper } from 'shared/styled-components';

type Props = {
  warning?: boolean;
  id: number;
  isAragon?: boolean;
  isUnknownContractCalled?: boolean;
};

// TODO: Add support for other parties besides Aragon
export const ProposalName = ({
  id,
  warning,
  isAragon,
  isUnknownContractCalled,
}: Props) => {
  return (
    <>
      <TitleWrapper>
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
          {isAragon && <Text size="xxs">Ongoing Aragon vote</Text>}
        </FlexWrapper>
      </TitleWrapper>
      {isUnknownContractCalled && (
        <UnknownContract>Unknown contract called</UnknownContract>
      )}
    </>
  );
};
