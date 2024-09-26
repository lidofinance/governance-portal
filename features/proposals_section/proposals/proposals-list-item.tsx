import { ProposalListItemWrapper } from '../styles';

type Props = {
  children?: React.ReactNode;
};
export const ProposalListItem = ({ children }: Props) => {
  return <ProposalListItemWrapper>{children}</ProposalListItemWrapper>;
};
