import styled from 'styled-components';

export const TiebreakerQuorumTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  tbody {
    margin-top: 12px;

    &:before {
      content: '@';
      display: block;
      line-height: 12px;
      text-indent: -99999px;
    }
    tr {
      border-top: 1px solid var(--border-color-fog);
      td {
        padding: 12px 0;
      }
    }
  }
`;
