import { Block, Whitepaper } from '@lidofinance/lido-ui';
import { IconWrapper } from './style';
import { Box } from 'shared/components/box';
import { Text } from 'shared/components/text';

export const ResourceCard = ({ title }: { title: string }) => {
  return (
    <Block>
      <Box display="flex" alignItems="center" gap={24}>
        <IconWrapper>
          <Whitepaper />
        </IconWrapper>
        <Text size={16} weight={500}>
          {title}
        </Text>
      </Box>
    </Block>
  );
};
