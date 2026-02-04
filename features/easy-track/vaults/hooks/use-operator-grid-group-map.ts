import { useCallback } from 'react';
import { isAddress } from 'ethers/lib/utils';
import { constants } from 'ethers';
import { DEFAULT_TIER_OPERATOR } from '../constants';
import { Group } from '../types';
import { useSimpleReducer } from 'shared/hooks/use-simple-reducer';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { OperatorGrid } from 'shared/blockchain/contracts';
import { Address } from 'viem';

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

      if (groupMap[lowerAddress] !== undefined) {
        return groupMap[lowerAddress]!;
      }

      try {
        const group = await operatorGrid.readContract('group', [
          lowerAddress as Address,
        ]);
        if (group.operator === constants.AddressZero) {
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
