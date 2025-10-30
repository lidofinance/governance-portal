import { Text } from 'shared/components/text';
import { DelegateCtaWrapper, IconWrapper, InfoWrapper } from './style';
import { LidoIcon } from 'shared/components/icons';
import { Link } from '@lidofinance/lido-ui';
import { VOTE_DELEGATION_PATH } from 'constants/urls';

export const DelegateCta = () => {
  return (
    <Link href={VOTE_DELEGATION_PATH}>
      <DelegateCtaWrapper>
        <InfoWrapper>
          <Text size={28}>Delegate LDO</Text>
          <Text size={16} color="secondary">
            Assign your LDO voting power to a delegate of your choice
          </Text>
        </InfoWrapper>
        <IconWrapper>
          <LidoIcon />
        </IconWrapper>
      </DelegateCtaWrapper>
    </Link>
  );
};
