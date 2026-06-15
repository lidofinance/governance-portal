import styled from 'styled-components';

export const MarkdownWrap = styled.div`
  hyphens: auto;
  overflow-wrap: anywhere;
  word-break: break-word;
  & p {
    white-space: pre-wrap;
  }
  & > * {
    margin-bottom: 16px;
  }
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    margin: 0 0 8px;
    font-weight: 600;
    line-height: 1.25;
  }
  & h1 {
    font-size: 18px;
  }
  & h2 {
    font-size: 16px;
  }
  & h3 {
    font-size: 15px;
  }
  & h4,
  & h5,
  & h6 {
    font-size: 13px;
  }
  & img {
    max-width: 100%;
  }
  & ol,
  & ul {
    padding-left: 20px;
  }
  & blockquote {
    padding: 0 1em;
    border-left: 0.25em solid var(--lido-color-border);
    //background-color: var(--lido-color-border);
    color: var(--lido-color-textSecondary);
  }
  & table {
    display: block;
    width: 100%;
    width: max-content;
    max-width: 100%;
    overflow: auto;
    border-spacing: 0;
    border-collapse: collapse;
    overflow-wrap: normal;
    word-break: normal;
  }
  & table tr {
    border-top: 1px solid var(--lido-color-border);
  }
  & table tr:nth-child(2n) {
    background-color: var(--lido-color-backgroundSecondary);
  }
  & table th,
  & table td {
    padding: 6px 13px;
    border: 1px solid var(--lido-color-border);
  }
  & pre {
    overflow: auto;
  }
  & pre > code {
    display: block;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    color: var(--lido-color-text);
    background-color: var(--lido-color-backgroundSecondary);
    border-radius: 6px;
    padding: 8px;
  }

  code {
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    color: var(--lido-color-text);
    background-color: var(--lido-color-backgroundSecondary);
    border-radius: 6px;
    padding: 2px 4px;
  }
`;
