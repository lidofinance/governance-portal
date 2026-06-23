import styled from 'styled-components';

export const PreviewWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  margin: ${({ theme }) => theme.spaceMap.lg}px 0;
`;
