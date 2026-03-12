import { Block } from '@lidofinance/lido-ui';
import { FormController } from 'shared/hook-form/form-controller';
import styled from 'styled-components';

export const PlaceOrderFormController = styled(FormController)`
  display: flex;
  flex-direction: column;
`;

export const PlaceOrderFormInfoWrapper = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PlaceOrderFormInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const PlaceOrderFormControls = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: 20px;

  margin-bottom: 20px;
`;
