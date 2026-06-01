import { createOrUpdateOperatorGroupAbi } from 'abi/generated';
import { pluralize } from 'utils/pluralize';
import { decodeExternalOperatorData } from '@easy-track/utils/nor-ext-operator-data';
import { MotionDescriptionProps } from '../types';
import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { getScriptFactoryByMotionType } from '@easy-track/utils/get-motion-type';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { StakingRouter } from 'shared/blockchain/contracts';
import { useNodeOperatorNames } from '@easy-track/hooks/use-node-operator-names';
import { formatBp } from '@easy-track/vaults/utils/format-vault-param';

const NO_GROUP_ID = 0n;

export const CreateOrUpdateOperatorGroup = ({
  callData,
  motionType,
}: MotionDescriptionProps<typeof createOrUpdateOperatorGroupAbi>) => {
  const { chainId } = useLidoSDK();
  const [groupId, groupInfo] = callData;
  const { name, subNodeOperators, externalOperators } = groupInfo;

  const getFactoryContractReader = useReadContractGetter(
    createOrUpdateOperatorGroupAbi,
  );
  const stakingRouter = useReadContract(StakingRouter);

  const { data: modulesInfo } = useQuery({
    queryKey: [`create-or-update-operator-group-modules`, chainId],
    queryFn: async () => {
      const factoryAddress = getScriptFactoryByMotionType(chainId, motionType);

      if (!factoryAddress) {
        return;
      }
      const readFactoryContract = getFactoryContractReader(factoryAddress);

      const [externalModuleId, mainModuleAddress] = await Promise.all([
        readFactoryContract('allowedExternalModuleId'),
        readFactoryContract('module'),
      ]);

      const externalModule = await stakingRouter.readContract(
        'getStakingModule',
        [externalModuleId],
      );

      return {
        externalModuleAddress: externalModule.stakingModuleAddress,
        externalModuleName: externalModule.name,
        mainModuleAddress,
      };
    },
  });

  const { data: mainModuleOperatorNames } = useNodeOperatorNames(
    modulesInfo?.mainModuleAddress,
    subNodeOperators.map((op) => op.nodeOperatorId),
  );

  const { data: externalModuleOperatorNames } = useNodeOperatorNames(
    modulesInfo?.externalModuleAddress,
    externalOperators.map(
      (op) => decodeExternalOperatorData(op.data).nodeOperatorId,
    ),
  );

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
      {isCreate ? 'Create new' : 'Update'} MetaRegistry operator group{' '}
      <b>
        {name}
        {!isCreate ? ` (#${groupId.toString()})` : ''}
      </b>{' '}
      with {pluralize(subNodeOperators.length, 'sub-operator')}
      {externalOperators.length > 0 && (
        <> and {pluralize(externalOperators.length, 'external operator')}</>
      )}
      :
      <ul>
        {subNodeOperators.map((op, index) => {
          const idStr = op.nodeOperatorId.toString();
          const name = mainModuleOperatorNames?.[index];
          const nameEl = name ? (
            <>
              <b>{name}</b> (id: {idStr})
            </>
          ) : (
            <b>#{idStr}</b>
          );

          return (
            <li key={`sub-${index}`}>
              sub-operator {nameEl} with share of <b>{formatBp(op.share)}</b>;
            </li>
          );
        })}

        {externalOperators.map((op, index) => {
          const decoded = decodeExternalOperatorData(op.data);
          const idStr = decoded.nodeOperatorId.toString();
          const name = externalModuleOperatorNames?.[index];

          const nameEl = name ? (
            <>
              <b>{name}</b> (id: {idStr})
            </>
          ) : (
            <b>#{idStr}</b>
          );

          const moduleNameEl = modulesInfo ? (
            <>
              <b>{modulesInfo.externalModuleName}</b> (id: {decoded.moduleId})
            </>
          ) : (
            <b>#{decoded.moduleId}</b>
          );

          return (
            <li key={`ext-${index}`}>
              external operator {nameEl} from module {moduleNameEl};
            </li>
          );
        })}
      </ul>
    </>
  );
};
