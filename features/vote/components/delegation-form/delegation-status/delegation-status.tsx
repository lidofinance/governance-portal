import { useAccount } from 'wagmi';
import {
  StatusesWrap,
  StatusLabel,
  DelegationStatusStyled,
  StatusValue,
  StatusWithIcon,
} from './style';
import { useDelegationFormData } from '@vote/providers/delegation-form-context';
import { SnapshotLogo } from 'shared/components/icons';
import { DelegationAddressBadge } from './delegation-address-badge';

export const DelegationStatus = () => {
  const { isConnected } = useAccount();
  const {
    aragonDelegateAddress,
    snapshotDelegateAddress,
    aragonPublicDelegate,
    snapshotPublicDelegate,
    loading,
  } = useDelegationFormData();

  if (!isConnected) {
    return null;
  }

  return (
    <StatusesWrap>
      <DelegationStatusStyled>
        <StatusWithIcon>
          <StatusLabel>On Aragon & Snapshot</StatusLabel>
        </StatusWithIcon>
        {aragonDelegateAddress ? (
          <DelegationAddressBadge
            publicDelegate={aragonPublicDelegate}
            address={aragonDelegateAddress}
            type="Aragon"
          />
        ) : (
          <StatusValue data-testid="delegationStatusAragon">
            {loading.isDelegationInfoLoading ? 'Loading...' : 'Not delegated'}
          </StatusValue>
        )}
      </DelegationStatusStyled>
      {snapshotDelegateAddress && (
        <>
          <DelegationStatusStyled>
            <StatusWithIcon>
              <SnapshotLogo />
              <StatusLabel>On Snapshot</StatusLabel>
            </StatusWithIcon>
            <DelegationAddressBadge
              address={snapshotDelegateAddress}
              publicDelegate={snapshotPublicDelegate}
              type="Snapshot"
            />
          </DelegationStatusStyled>
          <StatusValue data-testid="snapshotDelegationFootNote">
            Aragon delegation now applies to Snapshot too, so a separate
            Snapshot delegation is no longer needed.
          </StatusValue>
        </>
      )}
    </StatusesWrap>
  );
};
