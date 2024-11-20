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
  voteId: number;
  isAragon?: boolean;
  isUnknownContractCalled?: boolean;
};

// TODO: Add support for other parties except Aragon
export const ProposalName = ({
  voteId,
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
          <Title>Vote #{voteId}</Title>
          {isAragon && <Text size="xxs">Aragon vote</Text>}
        </FlexWrapper>
      </TitleWrapper>
      {isUnknownContractCalled && (
        <UnknownContract>Unknown contract called</UnknownContract>
      )}
    </>
  );
};
