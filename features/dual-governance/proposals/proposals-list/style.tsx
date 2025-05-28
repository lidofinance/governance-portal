import styled from 'styled-components';
import { Block, InlineLoader } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import { devicesHeaderMedia } from 'styles/global';

export const ProposalListItemWrapper = styled(Block)`
  font-size: 26px;
  border: 1px solid var(--border-color-fog);
  display: flex;
  cursor: pointer;
  padding: 30px;
  height: 100%;
  @media ${devicesHeaderMedia.tablet} {
    flex-direction: column;
  }
`;

export const SummarySection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-right: 20px;
  padding-top: 12px;
  @media ${devicesHeaderMedia.tablet} {
    padding: 20px 0;
  }
`;

export const ProposalDescription = styled.div`
  margin-left: auto;
  padding-left: 20px;
  word-wrap: break-word;
  width: 50%;
  flex-shrink: 0;
  border-left: 1px solid #0000001a;
  @media ${devicesHeaderMedia.tablet} {
    width: 100%;
    border-left: none;
    border-top: 1px solid #0000001a;
    padding: 20px 0 0;
  }
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

  @media ${devicesHeaderMedia.tablet} {
    grid-template-columns: 1fr;
  }
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

export const StatusBadgeWrapper = styled.div`
  justify-self: flex-start;
  align-self: flex-start;
`;

export const UnknownContract = styled.span`
  font-size: 15px;
  margin-top: 12px;
  border-radius: 8px;
  line-height: 1;
  color: var(--accent-color-berry);
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 8px;
`;
