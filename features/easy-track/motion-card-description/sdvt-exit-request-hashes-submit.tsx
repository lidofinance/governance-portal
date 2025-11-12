import { submitExitRequestHashesAbi } from 'abi/generated/SubmitExitRequestHashes';
import { useNodeOperatorsList } from '../hooks/use-node-operators-list';
import { MotionDescriptionProps } from './types';

export const SdvtExitRequestHashesSubmit = ({
  callData,
}: MotionDescriptionProps<typeof submitExitRequestHashesAbi>) => {
  const { data: nodeOperators } = useNodeOperatorsList('sdvt');

  const groupedCallDataMap = [...callData].reduce(
    (acc, item) => {
      const nodeOperatorId = Number(item.nodeOpId);

      if (!acc[nodeOperatorId]) {
        acc[nodeOperatorId] = [];
      }
      acc[nodeOperatorId].push(item);
      return acc;
    },
    {} as Record<number, (typeof callData)[number][]>,
  );

  const groupedCalldata = Object.values(groupedCallDataMap);

  return (
    <div>
      Submit exit request hashes for SDVT node operator
      {groupedCalldata.length > 1 ? 's' : ''}
      <br />
      {groupedCalldata.map((items, index) => {
        const nodeOpId = Number(items[0].nodeOpId);
        const nodeOperatorName = nodeOperators?.[nodeOpId].name;
        return (
          <div key={index}>
            {nodeOperatorName} (id: {nodeOpId})
            {items.map((item) => {
              return (
                <ul key={item.valPubKeyIndex.toString()}>
                  <li>
                    <b>Validator Index:</b> {item.valIndex.toString()};
                  </li>
                  <li>
                    <b>Validator Key Index:</b> {item.valPubKeyIndex.toString()}
                    ;
                  </li>
                  <li>
                    <b>Validator Public Key:</b> {item.valPubkey}.
                  </li>
                </ul>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
