import styled from 'styled-components';
import { Text } from 'shared/components/text';

export const TooltipText = styled(Text).attrs({
  size: 12,
  weight: 400,
})`
  color: var(--lido-color-contrast);
`;

export const LinkWrap = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  line-height: 1;

  svg {
    margin-left: 8px;
  }
`;
