import styled from 'styled-components';

export const CallTitle = styled.span<{ $warning?: boolean }>`
  border-radius: 8px;
  padding: 8px;
  background-color: ${({ $warning }) => ($warning ? '#D7475814' : '#13121714')};
  color: ${({ $warning }) =>
    $warning ? 'var(--accent-color-berry)' : 'var(--primary-color-black)'};
  margin: 0 8px;
  line-height: 3;
  font-weight: 500;
`;

export const NestedPadding = styled.div`
  display: flex;
  gap: 16px;
  align-items: baseline;
`;
