import styled, { css } from 'styled-components';

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

export const Title = styled.span<{ $warning?: boolean }>`
  font-size: 22px;
  font-weight: 600;
  color: ${({ $warning }) =>
    $warning ? 'var(--accent-color-berry)' : 'var(--primary-color-black)'};
`;

export const LogoWrapper = styled.div<{ $hasOffset: boolean }>`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 1px solid #0000001a;
  display: flex;
  padding: 14px;
  align-items: center;
  justify-content: center;
    ${({ $hasOffset }) =>
      $hasOffset &&
      css`
        svg {
          margin-left: -8px;
        }
      `}}
  
`;

export const WarningIconWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 1px solid #0000001a;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    margin-top: -4px;
  }
`;

export const UnknownContract = styled.span`
  font-size: 15px;
  padding: 8px;
  border-radius: 8px;
  line-height: 1;
  background-color: #d7475814;
  color: var(--accent-color-berry);
  align-self: flex-start;
`;
