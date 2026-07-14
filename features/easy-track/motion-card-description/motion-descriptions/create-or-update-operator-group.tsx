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

const getNameElement = (name: string | undefined, id: bigint | number) => {
  return name ? (
    <>
      <b>{name}</b> (id: {id.toString()})
    </>
  ) : (
    <b>#{id.toString()}</b>
  );
};

type GroupOperators = {
  subNodeOperators: readonly { nodeOperatorId: bigint; share: number }[];
  externalOperators: readonly { data: `0x${string}` }[];
};

type OperatorListProps = {
  group: GroupOperators;
  mainNames?: string[];
  externalNames?: string[];
  externalModuleName?: string;
  keyPrefix: string;
};

const OperatorList = ({
  group,
  mainNames,
  externalNames,
  externalModuleName,
  keyPrefix,
}: OperatorListProps) => (
  <ul>
    {group.subNodeOperators.map((op, index) => (
      <li key={`${keyPrefix}-sub-${index}`}>
        sub-operator {getNameElement(mainNames?.[index], op.nodeOperatorId)}{' '}
        with share of <b>{formatBp(op.share)}</b>;
      </li>
    ))}

    {group.externalOperators.map((op, index) => {
      const decoded = decodeExternalOperatorData(op.data);

      return (
        <li key={`${keyPrefix}-ext-${index}`}>
          external operator{' '}
          {getNameElement(externalNames?.[index], decoded.nodeOperatorId)} from
          module {getNameElement(externalModuleName, decoded.moduleId)};
        </li>
      );
    })}
  </ul>
);

export const CreateOrUpdateOperatorGroup = ({
  callData,
  motionType,
}: MotionDescriptionProps<typeof createOrUpdateOperatorGroupAbi>) => {
  const { chainId } = useLidoSDK();
  const [groupId, currentGroupInfo, groupInfo] = callData;
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

  const { data: currentMainOperatorNames } = useNodeOperatorNames(
    modulesInfo?.mainModuleAddress,
    currentGroupInfo.subNodeOperators.map((op) => op.nodeOperatorId),
  );

  const { data: currentExternalOperatorNames } = useNodeOperatorNames(
    modulesInfo?.externalModuleAddress,
    currentGroupInfo.externalOperators.map(
      (op) => decodeExternalOperatorData(op.data).nodeOperatorId,
    ),
  );

  const isCreate = groupId === NO_GROUP_ID;
  const isClear =
    !isCreate &&
    subNodeOperators.length === 0 &&
    externalOperators.length === 0;
  const hasCurrent =
    currentGroupInfo.subNodeOperators.length > 0 ||
    currentGroupInfo.externalOperators.length > 0;

  // clear group
  if (isClear) {
    return (
      <>
        Clear MetaRegistry operator group <b>#{groupId.toString()}</b>
        {hasCurrent ? (
          <>
            , removing:
            <OperatorList
              group={currentGroupInfo}
              mainNames={currentMainOperatorNames}
              externalNames={currentExternalOperatorNames}
              externalModuleName={modulesInfo?.externalModuleName}
              keyPrefix="current"
            />
          </>
        ) : (
          '.'
        )}
      </>
    );
  }

  // create group
  if (isCreate) {
    return (
      <>
        Create new MetaRegistry operator group <b>{name}</b> with{' '}
        {pluralize(subNodeOperators.length, 'sub-operator')}
        {externalOperators.length > 0 && (
          <> and {pluralize(externalOperators.length, 'external operator')}</>
        )}
        :
        <OperatorList
          group={groupInfo}
          mainNames={mainModuleOperatorNames}
          externalNames={externalModuleOperatorNames}
          externalModuleName={modulesInfo?.externalModuleName}
          keyPrefix="new"
        />
      </>
    );
  }

  // update group
  return (
    <>
      Update MetaRegistry operator group{' '}
      <b>
        {name} (#{groupId.toString()})
      </b>{' '}
      with {pluralize(subNodeOperators.length, 'sub-operator')}
      {externalOperators.length > 0 && (
        <> and {pluralize(externalOperators.length, 'external operator')}</>
      )}
      :
      {hasCurrent && (
        <>
          Current:
          <OperatorList
            group={currentGroupInfo}
            mainNames={currentMainOperatorNames}
            externalNames={currentExternalOperatorNames}
            externalModuleName={modulesInfo?.externalModuleName}
            keyPrefix="current"
          />
          New:
        </>
      )}
      <OperatorList
        group={groupInfo}
        mainNames={mainModuleOperatorNames}
        externalNames={externalModuleOperatorNames}
        externalModuleName={modulesInfo?.externalModuleName}
        keyPrefix="new"
      />
    </>
  );
};
