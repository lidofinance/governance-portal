import styled from 'styled-components';

type Props = {
  $isActive: boolean;
};

export const ButtonWrapper = styled.div<Props>`
  display: flex;
  padding: 3px;
  border-radius: 70px;
  border: 3px solid
    ${({ $isActive }) => ($isActive ? '#0085FF' : 'transparent')};
`;

export const ToggleWrapper = styled.div`
  display: flex;
  gap: 16px;
`;
