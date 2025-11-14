import { Fragment } from 'react';
import { submitExitRequestHashesAbi } from 'abi/generated/SubmitExitRequestHashes';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import { MotionDescriptionProps } from '../types';

export const CuratedExitRequestHashesSubmit = ({
  callData,
}: MotionDescriptionProps<typeof submitExitRequestHashesAbi>) => {
  const nodeOperatorId = Number(callData[0].nodeOpId);
  const { data: nodeOperators } = useNodeOperatorsList('curated');
  const nodeOperatorName = nodeOperators?.[nodeOperatorId]?.name ?? '';

  return (
    <div>
      Submit exit request hashes for node operator{' '}
      <b>
        {nodeOperatorName} (id: {nodeOperatorId})
      </b>
      <br />
      {callData.map((item, index) => {
        return (
          <Fragment key={index}>
            <br />
            <ul>
              <li>
                <b>Validator Index:</b> {item.valIndex.toString()};
              </li>
              <li>
                <b>Validator Key Index:</b> {item.valPubKeyIndex.toString()};
              </li>
              <li>
                <b>Validator Public Key:</b> {item.valPubkey}.
              </li>
            </ul>
          </Fragment>
        );
      })}
    </div>
  );
};
