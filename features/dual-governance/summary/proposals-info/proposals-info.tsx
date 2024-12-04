import { useProposalsInfo } from 'features/dual-governance/hooks/use-proposals-info';
import { Text } from 'shared/components/text';
import { ProposalsInfoStyled } from './style';

export const ProposalsInfo = () => {
  const { data, isLoading } = useProposalsInfo();

  // TODO: add view state
  if (isLoading || !data) {
    return null;
  }

  return (
    <ProposalsInfoStyled>
      <div>
        <Text color="secondary">Active Proposals</Text>
        <Text>{data.proposalsCount}</Text>
      </div>
      <div>
        <Text color="secondary">Executable on</Text>
        <Text>TBA</Text>
      </div>
    </ProposalsInfoStyled>
  );
};
