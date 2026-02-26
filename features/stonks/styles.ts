import styled from 'styled-components';

export const StonksTabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

// TODO: unify into global component
export const ErrorBox = styled.div`
  margin-bottom: 20px;
  padding: 20px 15px;
  font-size: 14px;
  background-color: rgba(255, 0, 0, 0.25);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md + 'px'};
`;
