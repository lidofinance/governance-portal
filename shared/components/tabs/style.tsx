import styled, { css } from 'styled-components';

export const FormWrapper = styled.div`
  margin-top: 24px;
  border-radius: 28px;
  border: 1px solid #0000001a;
`;

type TabProps = {
  $isActive: boolean;
  $disabled?: boolean;
};

export const StyledTab = styled.div<TabProps>`
  z-index: 1;
  border: 1px solid #0000001a;
  cursor: pointer;

  border-bottom: ${({ $isActive }) =>
    `2px solid ${$isActive ? '#0085FF' : '#0000001a'}`};
  background-color: ${({ $isActive }) =>
    $isActive ? 'transparent' : '#1312170A'};
  &:first-child {
    border-top-left-radius: 30px;
  }
  &:last-child {
    border-top-right-radius: 30px;
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
    `}
`;

export const TabsWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;

  & > ${StyledTab} {
    flex: 1;
  }
`;
