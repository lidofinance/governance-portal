import Link from 'next/link';
import styled from 'styled-components';

export const Wrap = styled(Link)`
  display: block;
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;

  & > p {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;
