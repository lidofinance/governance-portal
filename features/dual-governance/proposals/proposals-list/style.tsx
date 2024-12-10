import styled from 'styled-components';
import { Block, InlineLoader, Text } from '@lidofinance/lido-ui';

type ProposalDescriptionProps = {
  $slim?: boolean;
};

export const ProposalListItemWrapper = styled(Block)`
  font-size: 26px;
  border: 1px solid var(--border-color-fog);
  display: flex;
  cursor: pointer;
`;

export const ProposalListItemToEnact = styled(Block)`
  border: 1px solid var(--border-color-fog);
  background-color: #d7475833;
  display: flex;
  cursor: pointer;
`;

export const SummarySection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-right: 20px;
  border-right: 1px solid #0000001a;
  padding-top: 12px;
`;

export const ProposalDescription = styled.div<ProposalDescriptionProps>`
  padding: 6px 20px 0;
  max-width: ${({ $slim }) => ($slim ? '300px' : '100%')};
  word-wrap: break-word;
  width: ${({ $slim }) => ($slim ? '300px' : 'auto')};
`;

export const DescriptionText = styled(Text).attrs({
  size: 'sm',
})`
  color: #131217b8;
  margin-bottom: 12px;
`;

export const ProposalsListWrapper = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
`;

export const VoteStatusWrapper = styled.div`
  align-self: flex-start;
`;

export const ProposalSearchItemWrapper = styled.div`
  margin-top: 24px;
`;

export const InlineLoaderStyled = styled(InlineLoader)`
  margin-top: 24px;
  width: 100%;
  height: 200px;
  border-radius: 20px;
`;

export const ShowMoreWrapper = styled.div`
  text-align: center;
  margin-top: 20px;

  button {
    cursor: pointer;
    span {
      font-weight: 400;
    }
  }
`;
