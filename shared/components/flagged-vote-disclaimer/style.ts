import styled from 'styled-components';

export const DisclaimerWrap = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 20px;
  color: var(--lido-color-text);
  background-color: var(--accent-color-coral-light);

  svg {
    flex-shrink: 0;
  }
`;

export const DisclaimerTitle = styled.p`
  margin: 0 0 4px;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
`;

export const DisclaimerText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
`;
