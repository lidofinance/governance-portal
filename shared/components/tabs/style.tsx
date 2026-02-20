import styled, { css } from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';

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

  @media ${devicesHeaderMedia.tablet} {
    label {
      padding: 10px;
    }
  }
`;

export const TabsWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: stretch;

  & > ${StyledTab} {
    flex: 1;
  }
`;
