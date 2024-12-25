import styled from 'styled-components';
import { Block, InlineLoader } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';

export const ProposalListItemWrapper = styled(Block)`
  font-size: 26px;
  border: 1px solid var(--border-color-fog);
  display: flex;
  cursor: pointer;
  padding: 30px;
  height: 100%;
`;

export const SummarySection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-right: 20px;
  border-right: 1px solid #0000001a;
  padding-top: 12px;
`;

export const ProposalDescription = styled.div`
  padding-left: 20px;
  word-wrap: break-word;
  width: 50%;
`;

export const DescriptionText = styled(Text)`
  color: var(--primary-color-black-72);
  margin-bottom: 12px;
  font-size: 15px;
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

export const TimelockWrapper = styled.div`
  margin-top: 12px;
`;

export const TimeLockDescription = styled(Text)`
  font-size: 17px;
  color: var(--primary-color-black-72);
`;

export const StatusBadgeWrapper = styled.div`
  justify-self: flex-start;
  align-self: flex-start;
`;
