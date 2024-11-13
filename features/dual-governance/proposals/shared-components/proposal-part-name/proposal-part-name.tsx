import { ProposalsIcon, WarningIcon } from 'shared/components/icons';
import { LogoWrapper, Title, TitleWrapper, WarningIconWrapper } from './style';

type Props = {
  warning?: boolean;
  partName: string;
};

// TODO: Add support for other parties except Aragon
export const ProposalPartName = ({ partName, warning }: Props) => {
  return (
    <TitleWrapper>
      {warning ? (
        <WarningIconWrapper>
          <WarningIcon />
        </WarningIconWrapper>
      ) : (
        <LogoWrapper>
          <ProposalsIcon />
        </LogoWrapper>
      )}
      <Title>{partName}</Title>
    </TitleWrapper>
  );
};
