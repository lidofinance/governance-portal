import styled from 'styled-components';
import { Block, InlineLoader, Text } from '@lidofinance/lido-ui';
import Link from 'next/link';

export const ProposalContainer = styled(Block)`
  color: var(--primary-color-black);
`;

export const ProposalHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
`;

export const ProposalName = styled.div`
  margin-top: 30px;
  font-size: 76px;
  line-height: 1;
`;

export const SubmitDate = styled(Text)`
  font-size: 17px;
  color: var(--primary-color-black-72);
  margin-top: 30px;
`;

export const ProposalLink = styled(Link)`
  color: var(--accent-color-ocean);
`;

export const ProposalDescription = styled(Text)`
  margin-top: 30px;
  font-size: 22px;
  margin-bottom: 30px;
`;

export const ActionsWrapper = styled.div`
  margin-top: 30px;

  button {
    width: auto;
  }
`;

export const InlineLoaderStyled = styled(InlineLoader)`
  margin-top: 24px;
  width: 100%;
  height: 200px;
  border-radius: 20px;
`;

export const ArrowIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transform: rotate(180deg);
  border: 1px solid var(--border-color-fog);
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const AuthorDescription = styled.div`
  margin-top: 12px;
`;
