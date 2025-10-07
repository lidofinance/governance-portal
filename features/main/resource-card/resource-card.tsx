import { Whitepaper } from '@lidofinance/lido-ui';
import { ResourceCardWrapper, IconWrapper } from './style';
import { Text } from 'shared/components/text';

export const ResourceCard = ({ title }: { title: string }) => {
  return (
    <ResourceCardWrapper>
      <IconWrapper>
        <Whitepaper />
      </IconWrapper>
      <Text size={16} weight={500}>
        {title}
      </Text>
    </ResourceCardWrapper>
  );
};
