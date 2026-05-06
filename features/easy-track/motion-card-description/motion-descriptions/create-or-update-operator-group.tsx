import { createOrUpdateOperatorGroupAbi } from 'abi/generated';
import { pluralize } from 'utils/pluralize';
import {
  decodeNORExtOperatorData,
  NOR_EXT_OPERATOR_TYPE,
} from '@easy-track/utils/nor-ext-operator-data';
import { MotionDescriptionProps } from '../types';

const NO_GROUP_ID = 0n;

export const CreateOrUpdateOperatorGroup = ({
  callData,
}: MotionDescriptionProps<typeof createOrUpdateOperatorGroupAbi>) => {
  const [groupId, groupInfo] = callData;
  const { subNodeOperators, externalOperators } = groupInfo;

  const isCreate = groupId === NO_GROUP_ID;
  const isClear =
    !isCreate &&
    subNodeOperators.length === 0 &&
    externalOperators.length === 0;

  if (isClear) {
    return (
      <>
        Clear MetaRegistry operator group <b>#{groupId.toString()}</b>.
      </>
    );
  }

  return (
    <>
      {isCreate ? (
        <>Create new MetaRegistry operator group with </>
      ) : (
        <>
          Update MetaRegistry operator group <b>#{groupId.toString()}</b>{' '}
          with{' '}
        </>
      )}
      {pluralize(subNodeOperators.length, 'sub-operator')}
      {externalOperators.length > 0 && (
        <> and {pluralize(externalOperators.length, 'external operator')}</>
      )}
      :
      <ul>
        {subNodeOperators.map((op, index) => (
          <li key={`sub-${index}`}>
            Sub NO <b>#{op.nodeOperatorId.toString()}</b> — share{' '}
            <b>{op.share}</b> bp
          </li>
        ))}
        {externalOperators.map((op, index) => {
          const decoded = decodeNORExtOperatorData(op.data);
          const isNOR = decoded.operatorType === NOR_EXT_OPERATOR_TYPE;
          return (
            <li key={`ext-${index}`}>
              External NO <b>#{decoded.nodeOperatorId.toString()}</b> (module{' '}
              {decoded.moduleId}
              {!isNOR && <> — unsupported type {decoded.operatorType}</>})
            </li>
          );
        })}
      </ul>
    </>
  );
};
