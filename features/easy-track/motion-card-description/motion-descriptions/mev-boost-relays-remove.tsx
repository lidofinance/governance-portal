import { removeMevBoostRelaysAbi } from 'abi/generated/RemoveMEVBoostRelays';
import { useMEVBoostRelays } from '../../hooks/use-mev-boost-relays';
import { MotionDescriptionProps } from '../types';

export const MevBoostRelaysRemove = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof removeMevBoostRelaysAbi>) => {
  const { relaysMap, isRelaysDataLoading } = useMEVBoostRelays({
    enabled: isOnChain,
  });

  if (isRelaysDataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>Remove MEV Boost Relay{callData.length > 1 ? 's' : ''}</div>
      <ul>
        {callData.map((uri, index) => {
          const relayInfo = isOnChain ? relaysMap?.get(uri) : undefined;
          return (
            <li key={index}>
              <b>
                {relayInfo?.name
                  ? `${relayInfo.name} (${relayInfo.uriHost})`
                  : uri}
              </b>
            </li>
          );
        })}
      </ul>
    </>
  );
};
