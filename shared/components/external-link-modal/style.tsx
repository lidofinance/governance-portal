import styled from 'styled-components';

export const ExternalLinkModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  word-break: break-word;
  button {
    svg {
      margin-right: 0.6rem;
      path {
        fill: white;
      }
    }
  }
`;

export const ExternalLinkModalLink = styled.span`
  font-weight: 700;
  font-size: 14px;
`;
