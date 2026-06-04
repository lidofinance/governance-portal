import styled, { css } from 'styled-components';

export const Tabs = styled.div`
  position: relative;
  display: flex;
`;

type TabProps = { $isActive?: boolean; $variant?: 'voting' | 'dg' };

export const Tab = styled.div<TabProps>`
  position: relative;
  padding: 20px;
  font-size: 17px;
  font-weight: 600;
  color: var(--primary-color-black);
  border: 1px solid var(--border-color-fog);
  border-bottom: none;
  cursor: pointer;
  z-index: 1;
  width: 100%;
  text-align: center;

  ${({ $variant }) =>
    $variant &&
    $variant === 'voting' &&
    css`
      padding: 10px 24px;
      font-size: 14px;
      width: auto;
    `};

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 12px;
    padding: 8px 16px;
  }

  background-color: ${({ $isActive }) =>
    $isActive ? 'transparent' : '#1312170A'};

  &:not(:first-child) {
    border-left: none;
  }

  &:first-child {
    border-top-left-radius: 20px;
  }

  &:last-child {
    border-top-right-radius: 20px;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      border-bottom: 2px solid var(--accent-color-ocean-light);
    `}
`;

export const VoteScriptBodyWrap = styled.div<Pick<TabProps, '$variant'>>`
  font-size: 15px;
  position: relative;
  margin-top: -1px;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border: 1px solid var(--border-color-fog);
  background: #f0f2f6;
  line-height: 2;

  ${({ $variant }) =>
    $variant &&
    $variant === 'voting' &&
    css`
      border-top-right-radius: 20px;
      color: white;
    `};
`;

export const CallWrapper = styled.div<{ $withDg?: boolean }>`
  word-break: break-all;
  padding: 18px;

  ${({ $withDg }) =>
    $withDg &&
    css`
      background-color: rgba(0, 163, 255, 0.08);
    `}
`;

export const CallTitle = styled.span`
  font-weight: 600;
  a {
    font-weight: normal;
  }
`;

export const ScriptBox = styled.div`
  display: block;
  resize: vertical;
  width: 100%;
  font-family:
    SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;

  * {
    font-family: inherit;
  }

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  color: var(--lido-color-text);
  border-radius: 8px;
  word-break: break-all;
  white-space: pre-wrap;
`;

// Looks redundant, but we keep it for the future design improvements
export const CallFunction = styled.div`
  margin-top: 8px;
`;
export const CallData = styled.div`
  margin-top: 8px;
`;
export const CallDataItem = styled.div`
  font-weight: 500;
`;
export const NestedCallWrapper = styled.div`
  margin-top: 8px;
  border-left: 1px solid var(--lido-color-border);
`;

export const DGBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 6px;
  background-color: rgba(0, 163, 255, 0.1);
  border-radius: 5px;
  gap: 4px;
  width: fit-content;
  margin-left: auto;
  user-select: none;
  margin-bottom: 12px;

  & > svg {
    width: 16px;
    height: 16px;

    path {
      fill: var(--lido-color-primary);
    }
  }
`;
