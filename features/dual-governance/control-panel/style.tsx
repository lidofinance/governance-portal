import styled from 'styled-components';

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

  & > div {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const PreviewControls = styled.div`
  margin-top: auto;
`;
