import { encodeFunctionResult, type Hex } from 'viem';
import { lidoLendMarketManagerActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { MarketIdListFields } from '@easy-track/lido-lend/market-id-list-fields';

export const UnfreezeMarketsFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'marketIds'>;
}) => <MarketIdListFields fieldName={fieldNames.marketIds} />;

export const encodeUnfreezeMarkets = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeUnfreezeMarketsPayload',
    result: formData.marketIds.map(({ value }) => value as Hex),
  });
