import { setMerkleGateTreeAbi } from 'abi/generated/SetMerkleGateTree';
import { AddressPopInline } from 'shared/components/address-pop-inline';

import { MotionDescriptionProps } from '../types';
import { useMerkleGateInfo } from '@easy-track/hooks/use-merkle-gate-info';

export const SetMerkleGateTree = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof setMerkleGateTreeAbi>) => {
  const [gate, encodedCurrentRoot, encodedCurrentCid, newRoot, newCid] =
    callData;

  const { data: liveGateInfo } = useMerkleGateInfo(gate, isOnChain);

  const currentRoot = liveGateInfo?.treeRoot ?? encodedCurrentRoot;
  const currentCid = liveGateInfo?.treeCid ?? encodedCurrentCid;

  return (
    <div>
      <strong>Set Merkle Gate Tree:</strong>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        <li>
          <strong>Gate:</strong>
          <div style={{ marginLeft: '1rem' }}>
            <AddressPopInline address={gate} />
          </div>
        </li>
        <li style={{ marginTop: '1rem' }}>
          <strong>Tree Root:</strong>
          <div style={{ marginLeft: '1rem' }}>
            <div>
              <span>Current:</span> <code>{currentRoot}</code>
            </div>
            <div>
              <span>New:</span> <code>{newRoot}</code>
            </div>
          </div>
        </li>
        <li style={{ marginTop: '1rem' }}>
          <strong>Tree CID:</strong>
          <div style={{ marginLeft: '1rem' }}>
            <div>
              <span>Current:</span> <code>{currentCid}</code>
            </div>
            <div>
              <span>New:</span> <code>{newCid}</code>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
