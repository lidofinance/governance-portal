import {
  ActionCardHeader,
  ActionCardWrapper,
  ActionIconWrapper,
  ActionTitleWrapper,
} from './style';

type Props = {
  icon: React.ReactNode;
  addon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
};

export const ActionCard = ({ icon, addon, title, description }: Props) => {
  return (
    <ActionCardWrapper>
      <ActionCardHeader>
        <ActionIconWrapper>{icon}</ActionIconWrapper>
        {addon && <>{addon}</>}
      </ActionCardHeader>
      <ActionTitleWrapper>{title}</ActionTitleWrapper>
      {description && <>{description}</>}
    </ActionCardWrapper>
  );
};
