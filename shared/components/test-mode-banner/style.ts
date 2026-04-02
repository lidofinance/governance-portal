import styled from 'styled-components';

export const TestModeBannerWrap = styled.div`
  background-color: var(--lido-color-warningBackground);
  color: var(--lido-color-textDark);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  text-align: center;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
`;
