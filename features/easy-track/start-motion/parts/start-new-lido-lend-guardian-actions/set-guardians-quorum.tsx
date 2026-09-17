import { encodeFunctionResult, type Hex } from 'viem';
import { lidoLendGuardianActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { MarketIdField } from '@easy-track/lido-lend/market-id-field';
import { QuorumField } from './quorum-field';

export const SetGuardiansQuorumFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'marketId' | 'newQuorum'>;
}) => (
  <>
    <MarketIdField fieldName={fieldNames.marketId} />
    <QuorumField fieldName={fieldNames.newQuorum} />
  </>
);

export const encodeSetGuardiansQuorum = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeSetGuardiansQuorumPayload',
    result: [formData.marketId as Hex, BigInt(formData.newQuorum)],
  });
