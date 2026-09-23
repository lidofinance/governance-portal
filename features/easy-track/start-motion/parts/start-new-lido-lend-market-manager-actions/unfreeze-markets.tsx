import { encodeFunctionResult, type Hex } from 'viem';
import { lidoLendMarketManagerActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { MarketIdListFields } from '@easy-track/lido-lend/market-id-list-fields';
import { FieldsWrapper, FieldsHeader } from '../style';

export const UnfreezeMarketsFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'marketIds'>;
}) => (
  <FieldsWrapper>
    <FieldsHeader>Markets to unfreeze</FieldsHeader>
    <MarketIdListFields fieldName={fieldNames.marketIds} />
  </FieldsWrapper>
);

export const encodeUnfreezeMarkets = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeUnfreezeMarketsPayload',
    result: formData.marketIds.map(({ value }) => value as Hex),
  });
