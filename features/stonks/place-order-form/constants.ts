import { PlaceOrderFormInput } from '@stonks/types';

type FieldName = keyof PlaceOrderFormInput;

export const SELL_AMOUNT_NAME: FieldName = 'sellAmount';
export const MIN_BUY_AMOUNT_NAME: FieldName = 'minBuyAmount';
