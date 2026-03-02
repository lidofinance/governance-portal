import styled from 'styled-components';
import { Block, InlineLoader, Text } from '@lidofinance/lido-ui';
import { devicesHeaderMedia } from 'styles/global';

export const ProposalContainer = styled(Block)`
  color: var(--primary-color-black);
`;

export const ProposalHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
  @media ${devicesHeaderMedia.mobile} {
    gap: 10px;
    flex-wrap: wrap;
  }
`;

export const ProposalName = styled.div`
  margin-top: 30px;
  font-size: 76px;
  line-height: 1;

  @media ${devicesHeaderMedia.mobile} {
    font-size: 36px;
  }
`;

export const ProposalStateLogWrapper = styled.section`
  margin-top: 24px;
  min-height: 82px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SubmitDate = styled(Text)`
  font-size: 17px;
  color: var(--primary-color-black-50);
  line-height: 1.5;

  &:before {
    content: '\\2022';
  }
`;

export const ActionsWrapper = styled.div`
  margin-top: 30px;

  button {
    width: auto;
  }
`;

export const ArrowIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transform: rotate(180deg);
  border: 1px solid var(--border-color-fog);
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const EventsLoaderStyled = styled(InlineLoader)`
  margin-top: 12px;
  width: 300px;
  height: 16px;
  border-radius: 12px;
`;

export const DescriptionLoaderStyled = styled(InlineLoader)`
  margin-top: 24px;
  width: 100%;
  height: 80px;
  border-radius: 20px;
`;
