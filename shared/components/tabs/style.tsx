import styled, { css } from 'styled-components';

export const FormWrapper = styled.div`
  margin-top: 24px;
  border-radius: 28px;
  border: 1px solid #0000001a;
`;

type TabProps = {
  $isActive: boolean;
};

export const TabsWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledTab = styled.div<TabProps>`
  z-index: 1;
  width: 100%;
  border: 1px solid #0000001a;
  cursor: pointer;
  ${({ $isActive }) =>
    $isActive &&
    css`
      border-bottom: 2px solid #0085ff;
    `}
  background-color: ${({ $isActive }) =>
    $isActive ? 'transparent' : '#1312170A'};
  &:first-child {
    border-top-left-radius: 30px;
  }
  &:last-child {
    border-top-right-radius: 30px;
  }
`;
