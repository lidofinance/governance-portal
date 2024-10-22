import styled, { css } from 'styled-components';

type ButtonProps = {
  $type: 'primary' | 'secondary';
  $size: 'sm' | 'md' | 'lg';
};

const buttonTypeStyles = {
  primary: css`
    background-color: var(--primary-color-black);
    color: var(--primary-color-white);
  `,
  secondary: css`
    background-color: var(--primary-color-white);
    color: var(--primary-color-black);
    border: 1px solid var(--border-color-fog);
  `,
};

const buttonSizeStyles = {
  sm: css`
    padding: 10px 24px;
    height: 46px;
  `,
  md: css`
    padding: 17px 30px;
    height: 60px;
  `,
  lg: css`
    padding: 22px 36px;
    height: 70px;
  `,
};

export const StyledButton = styled.button<ButtonProps>`
  width: 100%;
  line-height: 1.5;
  font-weight: 500;
  border-radius: 32px;
  border: none;
  font-size: 17px;
  cursor: pointer;
  ${({ $type }) => buttonTypeStyles[$type]}
  ${({ $size }) => buttonSizeStyles[$size]}
`;
