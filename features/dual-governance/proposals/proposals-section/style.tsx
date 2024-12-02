import styled from 'styled-components';

export const ProposalsWrapper = styled.section`
  margin-top: 116px;
  align-items: flex-start;
  width: 100%;
`;

export const ProposalsTitle = styled.h1`
  font-size: 34px;
  color: var(--primary-color--black);
  font-weight: 500;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
`;

export const SeeAll = styled.span`
  padding: 10px 24px;
  font-size: 17px;
  border: 1px solid var(--border-color-fog);
  border-radius: 24px;
  cursor: pointer;
  line-height: 24px;

  a {
    color: var(--primary-color--black);
    &:visited {
      color: var(--primary-color--black);
      &:hover {
        color: var(--primary-color--black);
      }
    }
  }

  &:hover {
    border: 1px solid var(--border-color-water);
  }
`;
