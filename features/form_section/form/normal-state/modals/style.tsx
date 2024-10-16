import styled from 'styled-components';

import { Modal } from '@lidofinance/lido-ui';

export const StyledModal = styled(Modal)`
  & > div {
    width: 640px;
  }
`;

export const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
