import styled, { css } from 'styled-components';
import { Text } from '@lidofinance/lido-ui';

export const Tabs = styled.div`
  position: relative;
  display: flex;
`;

type TabProps = { isActive?: boolean };
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

  &:not(:first-child) {
    border-left: none;
  }

  &:first-child {
    border-top-left-radius: 20px;
  }

  &:last-child {
    border-top-right-radius: 20px;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      border-bottom: 1px solid var(--accent-color-ocean);
    `}
`;

export const VoteScriptBodyWrap = styled.div`
  position: relative;
  margin-top: -1px;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border: 1px solid var(--border-color-fog);
  font-size: 15px;
  font-weight: 600;
`;

export const CallWrapper = styled.div`
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  word-break: break-all;

  &:not(:last-child) {
    border-bottom: 1px solid var(--lido-color-border);
  }
`;

export const CallTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  font-weight: 600;
  font-family:
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    Liberation Mono,
    Courier New,
    monospace !important;
`;

export const NestedPadding = styled.div`
  margin-top: 10px;
  border-left: 2px solid var(--lido-color-borderLight);

  & > ${CallWrapper} {
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 0;
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

export const ScriptLoaderWrap = styled.div`
  &,
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:after {
    content: '';
    display: block;
    opacity: 0.6;
    background-color: var(--lido-color-foreground);
  }

  & > * {
    position: absolute;
    top: 50%;
    right: 50%;
  }
`;
