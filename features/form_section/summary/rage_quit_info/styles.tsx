import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';
type TextProps = {
  $size: string;
};

export const RageQuitInfoWrapper = styled.section`
  margin-top: 24px;
  align-items: center;
  display: flex;
`;

export const StyledText = styled.span<TextProps>`
  font-size: ${(props) => props.$size};
  &:last-child {
    padding-right: 8px;
  }
`;

export const Divider = styled.span`
  color: #00000033;
`;

export const BoldMetric = styled.span`
  font-weight: 600;
  color: #000;
`;

export const RageQuitProgressBarWrapper = styled.div`
  margin-top: 18px;
`;

export const RageQuitProgressBarDescription = styled(Text).attrs({
  size: 'md',
})`
  margin-top: 8px;
  color: #d74758;
`;

export const RageQuitProgressBarPercentage = styled.b`
  font-weight: 600;
`;
