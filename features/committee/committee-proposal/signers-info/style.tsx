import { Text } from 'shared/components/text';

import styled from 'styled-components';
import Link from 'next/link';

export const SignersInfoWrapper = styled.div`
  margin-top: 34px;
`;

export const SignersInfoSummary = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const SignersInfoSummaryText = styled(Text)`
  font-weight: 600;
  font-size: 15px;
`;

export const VoteStates = styled.section`
  display: flex;
  gap: 32px;
`;

export const VoteState = styled.span`
  background-color: #13121714;
  border-radius: 60px;
  padding: 4px 12px;
  color: var(--primary-color-black-72);
  margin-left: 8px;
`;

export const SignersList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

export const SignerLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SignerInfo = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
`;

export const SignerVoteState = styled.span`
  color: var(--primary-color-black-72);
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

export const SignerVoteLink = styled(Link)``;
