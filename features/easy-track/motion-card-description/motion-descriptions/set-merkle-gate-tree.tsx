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
    <ul>
      <li>
        Gate: <AddressPopInline address={gate} />
      </li>
      <li>
        Tree Root:
        <ul>
          <li>
            Current: <code>{currentRoot}</code>
          </li>
          <li>
            New: <code>{newRoot}</code>
          </li>
        </ul>
      </li>
      <li>
        Tree CID:
        <ul>
          <li>
            Current: <code>{currentCid}</code>
          </li>
          <li>
            New: <code>{newCid}</code>
          </li>
        </ul>
      </li>
    </ul>
  );
};
