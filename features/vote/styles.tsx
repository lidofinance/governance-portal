import styled from 'styled-components';
import {
  VOTE_CARD_MAX_WIDTH,
  VOTE_CARD_MOBILE_MAX_WIDTH,
  VOTE_MOBILE_MAX_WIDTH,
} from 'styles/constants';

export const VotePageWrap = styled.div`
  max-width: ${VOTE_CARD_MAX_WIDTH}px;
  margin: 0 auto;

  @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
    max-width: ${VOTE_CARD_MOBILE_MAX_WIDTH}px;
  }
`;
