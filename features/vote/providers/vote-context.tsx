import { createContext, FC, useContext } from 'react';
import invariant from 'tiny-invariant';
import { useVote, UseVoteData } from '../hooks/use-vote';

type Value = {
  voteData?: UseVoteData;
  isLoading: boolean;
};

type VoteProviderProps = {
  voteId: string;
  children?: React.ReactNode;
};

const VoteContext = createContext<Value>({
  voteData: {} as UseVoteData,
  isLoading: false,
});

export const useVoteContext = () => {
  const value = useContext(VoteContext);
  invariant(value, 'useVoteContext was used outside the VoteContext provider');
  return value;
};

export const VoteProvider: FC<VoteProviderProps> = ({ voteId, children }) => {
  const { data: voteData, isLoading } = useVote({ voteId: BigInt(voteId) });
  return (
    <VoteContext.Provider value={{ voteData, isLoading }}>
      {children}
    </VoteContext.Provider>
  );
};
