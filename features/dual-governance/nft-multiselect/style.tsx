import styled, { css } from 'styled-components';
import { Button, Checkbox, Input, PopupMenu } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';

// type StatusBadgeProps = {
//   $variant: 'success' | 'default';
// };
//
// export const Wrapper = styled.div`
//   width: 100%;
//   background: white;
// `;
//
// export const NftItemsList = styled.section`
//   padding: 0 16px;
//   border-radius: 30px;
//   border: 1px solid #0000001a;
// `;
//
type ItemProps = {
  $checked?: boolean;
  $interactive?: boolean;
};

export const NftItemWrapper = styled.div<ItemProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;

  ${({ $checked }) =>
    $checked &&
    css`
      background-color: #0085ff14;
    `}

  ${({ $interactive }) =>
    $interactive &&
    css`
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 133, 255, 0.1);
      }
      &:not(:last-child) {
        border-bottom: 1px solid #0000001a;
      }
    `}
  
    
  transition: background-color 0.2s;
  &:first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }
  &:last-child {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }
`;

export const Amount = styled(Text).attrs({
  color: 'secondary',
  size: 14,
})`
  margin-left: auto;
  margin-right: 8px;
`;

export const CheckboxStyled = styled(Checkbox)`
  // ignore flex gap
  margin-right: calc(20px - 8px);
`;

export const ActionsWrapper = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 10px;
`;

export const NftMultiselectInput = styled(Input)`
  width: 100%;
  *,
  & > * {
    cursor: pointer;
  }
  & > span {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    padding: 30px 14px 30px 20px;

    & > div {
      & > input {
        font-size: 17px;
      }
      & > span {
        font-size: 17px;
        color: var(--primary-color-black-50);
      }
    }
  }
`;

export const PopupMenuStyled = styled(PopupMenu)`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 30px;
`;

export const PopupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px 8px 16px;
`;

export const PopupSelectAllButton = styled(Button).attrs({
  variant: 'text',
  size: 'xs',
})`
  color: #0085ff;
  font-size: 17px;
  font-weight: 400;
  line-height: 26px;
  border-radius: 30px;
`;
