import { Text } from 'shared/components/text';
import { DelegateCtaWrapper, IconWrapper, InfoWrapper } from './style';
import { LidoIcon } from 'shared/components/icons';
import { Box } from 'shared/components/box';

export const DelegateCta = () => {
  return (
    <Box marginTop={40}>
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
    </Box>
  );
};
