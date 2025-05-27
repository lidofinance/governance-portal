import styled, { css } from 'styled-components';

export const Tabs = styled.div`
  position: relative;
  display: flex;
`;

type TabProps = { $isActive?: boolean };
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

export const VoteScriptBodyWrap = styled.div`
  padding: 16px 32px;
  font-size: 15px;
  position: relative;
  margin-top: -1px;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border: 1px solid var(--border-color-fog);
  background: #f0f2f6;
`;

export const CallWrapper = styled.div`
  word-break: break-all;
  margin-bottom: 16px;
  &:not(:last-child) {
    border-bottom: 1px solid var(--lido-color-border);
  }
`;

export const CallTitle = styled.span`
  font-weight: 600;
  b {
    font-weight: 800;
  }
  a {
    font-weight: normal;
  }
`;

export const ScriptBox = styled.div`
  display: block;
  resize: vertical;
  width: 100%;
  font-family:
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    Liberation Mono,
    Courier New,
    monospace !important;
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
  font-weight: 600;
`;
export const NestedCallWrapper = styled.div`
  margin-top: 8px;
`;
