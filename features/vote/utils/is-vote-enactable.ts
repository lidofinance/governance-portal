import { Vote } from 'shared/votes/types';

const EMPTY_SCRIPT = '0x00000001';

export const isVoteEnactable = (script: Vote['script']) => {
  return script && script !== EMPTY_SCRIPT;
};
