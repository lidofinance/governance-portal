import styled from 'styled-components';

type ButtonProps = {
  $isActive: boolean;
};

export const StyledButton = styled.button<ButtonProps>`
  padding: 20px 32px;
  border-radius: 32px;
  font-size: 18px;
  cursor: pointer;
  background-color: ${({ $isActive }) => ($isActive ? '#000' : 'transparent')};
  color: ${({ $isActive }) => ($isActive ? '#fff' : '#000')};
`;

export const ToggleWrapper = styled.div`
  display: flex;
  gap: 16px;
`;
