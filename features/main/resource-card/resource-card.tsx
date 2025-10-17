import { ResourceCardWrapper, IconWrapper } from './style';
import { Text } from 'shared/components/text';

type Props = {
  title: string;
  icon: React.ReactNode;
};

export const ResourceCard = ({ title, icon }: Props) => {
  return (
    <ResourceCardWrapper>
      <IconWrapper>{icon}</IconWrapper>
      <Text size={16} weight={500}>
        {title}
      </Text>
    </ResourceCardWrapper>
  );
};
