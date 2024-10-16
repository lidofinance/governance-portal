import styled, { css } from 'styled-components';

type WrapperProps = {
  $hasBorder?: boolean;
};

export const Wrapper = styled.div<WrapperProps>`
  width: 100%;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid #0000001a;
`;

export const ItemsList = styled.div`
  padding: 16px;
  background-color: aqua;
  border-radius: 12px;
  margin-top: 20px;
`;
