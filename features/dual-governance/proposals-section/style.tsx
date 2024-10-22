import styled from 'styled-components';
import { Block, Text } from '@lidofinance/lido-ui';
import { boolean } from '@metamask/superstruct';

type ProposalDescriptionProps = {
  $slim?: boolean;
};

export const ProposalsWrapper = styled.section`
  margin-top: 116px;
  align-items: flex-start;
  width: 100%;
`;

export const ProposalsTitle = styled.h1`
  font-size: 34px;
  color: #000;
  font-weight: 500;
  text-transform: capitalize;
`;

export const ProposalListItemWrapper = styled(Block)`
  min-height: 378px; // TODO: remove
  font-size: 26px;
  border: 1px solid var(--border-color-fog);
  display: flex;
`;

export const ProposalListItemToEnact = styled(Block)`
  border: 1px solid var(--border-color-fog);
  background-color: #d7475833;
  display: flex;
`;

export const LogoWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 1px solid #0000001a;
  display: flex;
  padding: 14px;
  align-items: center;
  justify-content: center;
  svg {
    margin-left: -8px;
  }
`;

export const WarningIconWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 1px solid #0000001a;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    margin-top: -4px;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Title = styled.span<{ $warning?: boolean }>`
  font-size: 22px;
  font-weight: 600;
  color: ${({ $warning }) =>
    $warning ? 'var(--accent-color-berry)' : 'var(--primary-color-black)'};
`;

export const ProposalStatus = styled(Text).attrs({
  color: 'secondary',
  size: 'sm',
})`
  margin-top: 8px;
  background-color: #1312170f;
  border-radius: 18px;
  padding: 6px 12px;
`;

export const SummarySection = styled.section`
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  border-right: 1px solid #0000001a;
  padding-top: 12px;
  flex-shrink: 0;
`;

export const ProposalDescription = styled.div<ProposalDescriptionProps>`
  padding: 6px 20px 0;
  border-right: 1px solid #0000001a;
  max-width: ${({ $slim }) => ($slim ? '300px' : 'auto')};
`;

export const DescriptionText = styled(Text).attrs({
  size: 'sm',
})`
  color: #131217b8;
`;

export const ScriptSection = styled.section`
  padding-left: 20px;
`;
