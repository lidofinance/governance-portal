import styled from 'styled-components';
import { InlineLoader } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';

export const ControlPanelWrapper = styled.div`
  padding: 40px;
  width: 60%;
  background: rgba(255, 255, 255, 0.9);
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  display: flex;
  flex-direction: column;
`;

export const ControlPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26px;

  & > div:first-child {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export const PreviewProposalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  margin-bottom: 40px;
`;

export const PreviewControls = styled.div`
  margin-top: auto;
`;

export const Description = styled(Text)`
  font-size: 22px;
  font-weight: 200;
  line-height: 1.8;
  margin: 24px 0;
`;

export const ProposalWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  svg {
    margin-left: -8px;
    margin-top: -8px;
    transform: scale(0.8);
    flex-shrink: 0;
  }
  p {
    flex-shrink: 0;
  }
  div {
    word-wrap: break-word;
  }
`;

export const VoteWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  svg {
    transform: scale(0.8);
  }
`;

export const InlineLoaderStyled = styled(InlineLoader)`
  width: 100%;
  height: 50px;
  margin-top: 20px;
  border-radius: 20px;
`;
