import { Text } from 'shared/components/text';
import { InlineLoaderStyled, ProposalsInfoStyled } from './style';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';

export const ProposalsInfo = () => {
  const { activeProposals, isLoading } = useDualGovernanceProposalsContext();

  return (
    <ProposalsInfoStyled>
      <>
        <Text color="secondary">Active Proposals</Text>
        {isLoading && <InlineLoaderStyled />}
        {!isLoading && <Text>{activeProposals.length}</Text>}
      </>
    </ProposalsInfoStyled>
  );
};
