import { createContext, FC, useContext } from 'react';
import invariant from 'tiny-invariant';
import { useVote, UseVoteReturnType } from '../hooks/use-vote';

type Value = {
  voteData: UseVoteReturnType;
};

type VoteProviderProps = {
  voteId: string;
  children?: React.ReactNode;
};

const VoteContext = createContext<Value>({ voteData: null });

export const useVoteContext = () => {
  const value = useContext(VoteContext);
  invariant(value, 'useVoteContext was used outside the VoteContext provider');
  return value;
};

export const VoteProvider: FC<VoteProviderProps> = ({ voteId, children }) => {
  const voteData = useVote({ voteId: BigInt(voteId) });
  return (
    <VoteContext.Provider value={{ voteData }}>{children}</VoteContext.Provider>
  );
};
