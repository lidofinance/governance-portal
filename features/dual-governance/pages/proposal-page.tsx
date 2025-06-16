import { ProposalFullInfo } from 'features/dual-governance/proposals/proposal-full-info';
import { VisibleGovernanceState } from '../types';
import { BackgroundGradient } from 'shared/components';
import Head from 'next/head';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import { useEffect } from 'react';
import { useChainId } from 'wagmi';
import { syncAddressesWithServer } from 'utils/dynamic-addresses';

export const ProposalPage = ({ id }: { id: number }) => {
  const { visibleState } = useDualGovernanceStateContext();
  const chainId = useChainId();

  // Sync governance addresses with server when navigating to proposal page
  useEffect(() => {
    syncAddressesWithServer(chainId).catch((error) => {
      console.error('Failed to sync governance addresses with server:', error);
    });
  }, [chainId]);

  return (
    <>
      <Head>
        <title>Dual Governance | Lido</title>
      </Head>
      {visibleState !== VisibleGovernanceState.Loading && (
        <BackgroundGradient state={visibleState} width={1700} height={800} />
      )}
      <ProposalFullInfo id={id} />
    </>
  );
};
