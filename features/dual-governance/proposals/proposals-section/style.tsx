import styled from 'styled-components';
import { Block, Text } from '@lidofinance/lido-ui';

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
  color: var(--primary-color--black);
  font-weight: 500;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 30px;
`;

export const SeeAll = styled.span`
  padding: 10px 24px;
  font-size: 17px;
  border: 1px solid var(--border-color-fog);
  border-radius: 24px;
  cursor: pointer;
  line-height: 24px;

  &:hover {
    color: var(--accent-color-ocean);
    border: 1px solid var(--border-color-water);
  }
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

export const SummarySection = styled.section`
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  border-right: 1px solid #0000001a;
  padding-top: 12px;
  width: 300px;
`;

export const ProposalDescription = styled.div<ProposalDescriptionProps>`
  padding: 6px 20px 0;
  border-right: 1px solid #0000001a;
  max-width: ${({ $slim }) => ($slim ? '300px' : 'auto')};
  word-wrap: break-word;
  width: 300px;
`;

export const DescriptionText = styled(Text).attrs({
  size: 'sm',
})`
  color: #131217b8;
  margin-bottom: 12px;
`;

export const ScriptSection = styled.section`
  padding-left: 20px;
`;

export const LinkWrapper = styled.div`
  margin-left: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 52px;
  width: 52px;
  border-radius: 50%;
  border: 1px solid var(--border-color-mist);
  cursor: pointer;
  flex-shrink: 0;
`;
