import React from 'react';
import styled from 'styled-components';
import { Input, Modal, ModalProps, Button } from '@lidofinance/lido-ui';

// Overwrite default modal container width which is hardcoded 432px
export const StyledModal = styled(Modal)<ModalProps>`
  & > div {
    width: 640px;
    border-radius: 50px;
  }
` as React.FC<ModalProps>;

export const StyledInput = styled(Input)`
  span {
    padding: 17px 26px;
    border-radius: 30px;

    &:focus-within {
      border-color: #0085ff99;
    }
  }
`;

export const NftList = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
`;

export const RevokeModalControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RevokeModalWrapper = styled.div`
  padding: 0 8px 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const RevokeModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SelectAllButton = styled(Button).attrs({
  variant: 'text',
  size: 'xs',
})`
  color: #0085ff;
  font-size: 17px;
  font-weight: 400;
  line-height: 26px;
  border-radius: 30px;
`;
