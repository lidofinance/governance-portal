import styled from 'styled-components';
import { Block, InlineLoader, Text, Link } from '@lidofinance/lido-ui';
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

export const ProposalLink = styled(Link)`
  color: var(--accent-color-ocean);
`;

export const ActionsWrapper = styled.div`
  margin-top: 30px;

  button {
    width: auto;
  }
`;

export const InlineLoaderStyled = styled(InlineLoader)`
  margin-top: 24px;
  width: 100%;
  height: 200px;
  border-radius: 20px;
`;

export const SubmittedBy = styled.div`
  margin: 30px 0;
  word-break: break-word;
`;

export const SubmitterAddressWrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;
