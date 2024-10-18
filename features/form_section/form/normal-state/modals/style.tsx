import React from 'react';
import styled from 'styled-components';
import { Modal, ModalProps } from '@lidofinance/lido-ui';

// Overwrite default modal container width which is hardcoded 432px
export const StyledModal = styled(Modal)<ModalProps>`
  & > div {
    width: 640px;
  }
` as React.FC<ModalProps>;

export const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
