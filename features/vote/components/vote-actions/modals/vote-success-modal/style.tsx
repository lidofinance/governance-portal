import styled from 'styled-components';

export const AddonSection = styled.section`
  background: #eff2f6;
  padding: 16px;
  border-radius: 20px;
  margin-top: 40px;
  display: flex;
  gap: 16px;
  flex-direction: column;

  svg {
    display: block;
    margin-right: ${({ theme }) => theme.spaceMap.sm}px;
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`;
