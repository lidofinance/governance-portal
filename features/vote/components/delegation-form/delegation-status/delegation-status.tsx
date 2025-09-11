import { useAccount } from 'wagmi';
import {
  StatusesWrap,
  StatusLabel,
  DelegationStatusStyled,
  StatusValue,
  StatusWithIcon,
} from './style';
import { useDelegationFormData } from 'features/vote/providers/delegation-form-context';
import { AragonSmallLogo, SnapshotLogo } from 'shared/components/icons';
import { DelegationAddressBadge } from './delegation-address-badge';

export const DelegationStatus = () => {
  const { isConnected } = useAccount();
  const {
    mode,
    aragonDelegateAddress,
    snapshotDelegateAddress,
    aragonPublicDelegate,
    snapshotPublicDelegate,
    loading,
  } = useDelegationFormData();

  if (!isConnected) {
    return null;
  }

  if (mode === 'simple') {
    return (
      <StatusesWrap>
        <DelegationStatusStyled>
          <StatusWithIcon>
            <AragonSmallLogo />
            <StatusLabel>On Aragon</StatusLabel>
          </StatusWithIcon>
          {aragonDelegateAddress ? (
            <DelegationAddressBadge
              publicDelegate={aragonPublicDelegate}
              address={aragonDelegateAddress}
              type="aragon"
            />
          ) : (
            <StatusValue>
              {loading.isDelegationInfoLoading ? 'Loading...' : 'Not delegated'}
            </StatusValue>
          )}
        </DelegationStatusStyled>
        <DelegationStatusStyled>
          <StatusWithIcon>
            <SnapshotLogo />
            <StatusLabel>On Snapshot</StatusLabel>
          </StatusWithIcon>
          {snapshotDelegateAddress ? (
            <DelegationAddressBadge
              address={snapshotDelegateAddress}
              publicDelegate={snapshotPublicDelegate}
              type="snapshot"
            />
          ) : (
            <StatusValue>
              {loading.isDelegationInfoLoading ? 'Loading...' : 'Not delegated'}
            </StatusValue>
          )}
        </DelegationStatusStyled>
      </StatusesWrap>
    );
  }

  const delegateAddress =
    mode === 'aragon' ? aragonDelegateAddress : snapshotDelegateAddress;
  const publicDelegate =
    mode === 'aragon' ? aragonPublicDelegate : snapshotPublicDelegate;

  return (
    <DelegationStatusStyled>
      <StatusLabel>Delegated to</StatusLabel>
      {delegateAddress ? (
        <DelegationAddressBadge
          address={delegateAddress}
          publicDelegate={publicDelegate}
          type={mode}
        />
      ) : (
        <StatusValue>
          {loading.isDelegationInfoLoading ? 'Loading...' : 'Not delegated'}
        </StatusValue>
      )}
    </DelegationStatusStyled>
  );
};
