import { Text } from 'shared/components/text';
import { ProposalsInfoStyled } from './style';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';

export const ProposalsInfo = () => {
  const { activeProposals, isLoading } = useDualGovernanceProposalsContext();

  // TODO: add view state
  if (isLoading || !activeProposals) {
    return null;
  }

  return (
    <ProposalsInfoStyled>
      <div>
        <Text color="secondary">Active Proposals</Text>
        <Text>{activeProposals.length}</Text>
      </div>
      <div>
        <Text color="secondary">Executable on</Text>
        <Text>TBA</Text>
      </div>
    </ProposalsInfoStyled>
  );
};
