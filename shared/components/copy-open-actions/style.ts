import styled from 'styled-components';

export const Wrap = styled.div`
  display: flex;
  cursor: pointer;

  & > *:not(:last-child) {
    margin-right: 10px;
  }

  button {
    padding: 4px;
  }
`;
