import styled, { css } from 'styled-components';
import { Text } from 'shared/components/text';

export const ObjectionsTitle = styled(Text).attrs({
  size: 12,
  weight: 500,
})`
  margin-bottom: 6px;
  color: 'inherit';
`;

export const ObjectionsValue = styled(Text).attrs({
  size: 14,
  weight: 800,
})`
  margin-bottom: 8px;
  color: 'inherit';
`;

export const ObjectionsThreshold = styled.span`
  opacity: 0.4;
`;

export const ObjectionsPercents = styled(Text).attrs({
  size: 36,
  weight: 800,
})`
  color: 'inherit';
`;

type ObjectionsInfoProps = {
  isSucceed: boolean;
  isDangered: boolean;
};
export const ObjectionsInfo = styled.div<ObjectionsInfoProps>`
  ${({ isSucceed }) =>
    isSucceed &&
    css`
      color: #53ba95;
    `}

  ${({ isDangered }) =>
    isDangered &&
    css`
      color: #de186b;
    `}
`;
