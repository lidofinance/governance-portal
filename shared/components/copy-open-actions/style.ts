import styled from 'styled-components';

export const Wrap = styled.div`
  display: flex;
  margin-left: 2px;

  & > *:not(:last-child) {
    margin-right: 10px;
  }

  button {
    padding: 4px;
  }
`;
