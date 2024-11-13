// TODO: get proposals from contract

// TODO: remove
import { ProposalStatus } from 'features/dual-governance/proposals/shared-components/proposal-status-badge';

// TODO: remove
const mockProposals = [
  {
    name: 'Vote #176 part 1',
    status: ProposalStatus.PENDING,
    description:
      'Replace Rated Labs with MatrixedLink in Lido on Ethereum Oracle set',
  },
  {
    name: 'Vote #176 part 1',
    status: ProposalStatus.EXECUTED,
    description:
      'Replace Rated Labs with MatrixedLink in Lido on Ethereum Oracle set',
  },
  {
    name: 'Vote #176 part 1',
    status: ProposalStatus.READY_TO_EXECUTE,
    description:
      'Replace Rated Labs with MatrixedLink in Lido on Ethereum Oracle set',
  },
  {
    name: 'Vote #176 part 1',
    status: ProposalStatus.EXECUTED,
    description:
      'Replace Rated Labs with MatrixedLink in Lido on Ethereum Oracle set',
  },
  {
    name: 'Vote #176 part 1',
    status: ProposalStatus.READY_TO_EXECUTE,
    description:
      'Replace Rated Labs with MatrixedLink in Lido on Ethereum Oracle set',
  },
  {
    name: 'Vote #176 part 1',
    status: ProposalStatus.PENDING,
    description:
      'Replace Rated Labs with MatrixedLink in Lido on Ethereum Oracle set',
  },
  {
    name: 'Vote #176 part 1',
    status: ProposalStatus.PENDING,
    description:
      'Replace Rated Labs with MatrixedLink in Lido on Ethereum Oracle set',
  },
  {
    name: 'Vote #176 part 1',
    status: ProposalStatus.EXECUTED,
    description:
      'Replace Rated Labs with MatrixedLink in Lido on Ethereum Oracle set',
  },
];

export const useProposals = () => {
  return {
    proposals: mockProposals,
  };
};
