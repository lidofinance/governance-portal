import { editMevBoostRelaysAbi } from 'abi/generated/EditMEVBoostRelays';
import { MotionDescriptionProps } from './types';
import { MEVBoostRelay } from './types-mev';
import { useMEVBoostRelays } from '../hooks/use-mev-boost-relays';

type RelayChange = {
  uri: string;
  operator: string;
  is_mandatory: boolean;
  description: string;
};

type RowProps = {
  change: RelayChange;
  relayInfo: (MEVBoostRelay & { uriHost: string }) | undefined;
};

const RelayDescriptionRow = ({ change, relayInfo }: RowProps) => {
  if (relayInfo) {
    return (
      <div>
        — Edit relay <b>{relayInfo.name}</b> ({relayInfo.uriHost}) params:
        <ul>
          {relayInfo.name !== change.operator && (
            <li>
              <b>Name:</b> {relayInfo.name} &gt; {change.operator};
            </li>
          )}
          {relayInfo.description !== change.description && (
            <li>
              <b>Description:</b> {relayInfo.description} &gt;{' '}
              {change.description};
            </li>
          )}
          {relayInfo.isMandatory !== change.is_mandatory && (
            <li>
              <b>Mandatory:</b> {relayInfo.isMandatory ? 'true' : 'false'} &gt;
              {change.is_mandatory ? 'true' : 'false'};
            </li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div>
      — Edit relay <b>{change.uri}</b> params:
      <ul>
        <li>
          <b>Name:</b> {change.operator}
        </li>
        <li>
          <b>Description:</b> {change.description}
        </li>
        <li>
          <b>Mandatory:</b> {change.is_mandatory ? 'true' : 'false'}
        </li>
      </ul>
    </div>
  );
};

export const MevBoostRelaysEdit = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof editMevBoostRelaysAbi>) => {
  const { relaysMap, isRelaysDataLoading } = useMEVBoostRelays();

  if (isRelaysDataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {callData.map((change, index) => (
        <RelayDescriptionRow
          key={index}
          change={change}
          relayInfo={isOnChain ? relaysMap?.get(change.uri) : undefined}
        />
      ))}
    </>
  );
};
