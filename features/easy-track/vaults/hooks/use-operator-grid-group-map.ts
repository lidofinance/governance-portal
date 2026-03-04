import { useCallback } from 'react';
import { DEFAULT_TIER_OPERATOR } from '../constants';
import { Group } from '../types';
import { useSimpleReducer } from 'shared/hooks/use-simple-reducer';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { OperatorGrid } from 'shared/blockchain/contracts';
import { Address, isAddress, zeroAddress } from 'viem';

export const useOperatorGridGroupMap = () => {
  const [groupMap, setState] = useSimpleReducer<
    Record<string, Group | null | undefined>
  >({});

  const operatorGrid = useReadContract(OperatorGrid);
  const getOperatorGridGroup = useCallback(
    async (address: string) => {
      if (!isAddress(address)) {
        return null;
      }

      const lowerAddress = address.toLowerCase();

      const cached = groupMap[lowerAddress];
      if (cached !== undefined) {
        return cached;
      }

      try {
        const group = await operatorGrid.readContract('group', [
          lowerAddress as Address,
        ]);
        if (group.operator === zeroAddress) {
          // Check for default tier group
          if (lowerAddress === DEFAULT_TIER_OPERATOR) {
            const defaultGroup = {
              ...group,
              operator: DEFAULT_TIER_OPERATOR,
              tierIds: [0n],
            };

            setState({ [lowerAddress]: defaultGroup });
            return defaultGroup;
          }

          setState({ [lowerAddress]: null });
          return null;
        }
        setState({ [lowerAddress]: group });
        return group;
      } catch (error) {
        setState({ [lowerAddress]: null });
        return null;
      }
    },
    [groupMap, operatorGrid, setState],
  );

  return {
    groupMap,
    getOperatorGridGroup,
  };
};
