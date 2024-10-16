import styled, { css } from 'styled-components';

type ButtonProps = {
  $type: 'primary' | 'secondary';
};

const buttonStyles = {
  primary: css`
    background-color: #000;
    color: #fff;
  `,
  secondary: css`
    background-color: #fff;
    color: #000;
  `,
};

export const StyledButton = styled.button<ButtonProps>`
  width: 100%;
  padding: 14px 24px;
  border-radius: 32px;
  font-size: 18px;
  cursor: pointer;
  ${({ $type }) => buttonStyles[$type]}
`;
