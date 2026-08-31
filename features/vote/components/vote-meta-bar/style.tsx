import styled, { css } from 'styled-components';
import { Tooltip } from '@lidofinance/lido-ui';
import { Wrap as BadgeWrap } from 'shared/components/badge/style';
import {
  VOTE_CARD_MAX_WIDTH,
  VOTE_CARD_MOBILE_MAX_WIDTH,
  VOTE_MOBILE_MAX_WIDTH,
} from 'styles/constants';

export const MetaWrap = styled.div<{ $labeled?: boolean }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: ${({ theme }) => theme.spaceMap.xl}px;
  font-size: 14px;

  ${({ $labeled }) =>
    $labeled &&
    css`
      ${BadgeWrap},
      ${MetaLabel} {
        font-size: 12px;
      }

      @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
        ${VoteIdText},
        ${CountdownText},
        ${EndedText} {
          font-size: 14px;
        }
      }
    `}

  ${({ $labeled }) =>
    !$labeled &&
    css`
      @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
        ${VoteIdText},
        ${CountdownText},
        ${EndedText} {
          font-size: 14px;
        }

        ${BadgeWrap} {
          font-size: 12px;
        }
      }

      @media (max-width: ${VOTE_CARD_MOBILE_MAX_WIDTH}px) {
        flex-direction: column;
        align-items: flex-start;
      }
    `}
`;

export const BadgeGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TimeGroup = styled.div<{ $labeled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $labeled }) => ($labeled ? '54px' : '8px')};
  ${({ $labeled }) =>
    $labeled &&
    css`
      margin-left: auto;

      @media (max-width: ${VOTE_CARD_MAX_WIDTH - 1}px) {
        margin-left: 0;
      }
    `}
`;

export const PhaseNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--accent-color-sky);
  color: var(--lido-color-foreground);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
`;

export const MetaLabel = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--lido-color-textSecondary);
`;

export const MetaCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const VoteIdText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--lido-color-text);
`;

export const Separator = styled.span`
  display: inline-block;
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background-color: var(--lido-color-textSecondary);
`;

export const CountdownText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--lido-color-text);
`;

export const EndedText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--lido-color-textSecondary);
`;

export const PhaseTooltip = styled(Tooltip)`
  && {
    max-width: 320px;

    @media (max-width: ${VOTE_MOBILE_MAX_WIDTH}px) {
      left: 16px !important;
      right: 16px;
      max-width: unset;
    }
  }
`;

export const TooltipText = styled.div`
  font-size: 12px;
`;

export const TooltipList = styled.ul`
  margin: 4px 0 0;
  padding-left: 18px;
  list-style: disc;

  li:not(:first-child) {
    margin-top: 4px;
  }
`;

export const TooltipIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;
