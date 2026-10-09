import { parseEther } from 'viem';
import { VoteMode } from './types';

export const DELEGATORS_PAGE_SIZE = 20;
export const DAO_OPS_FORUM_LINK =
  'https://research.lido.fi/new-message?groupname=DAO_Ops';

export const SNAPSHOT_LIDO_SPACE_NAME =
  '0x6c69646f2d736e617073686f742e657468000000000000000000000000000000'; // lido-snapshot.eth

export const ONE_LDO = parseEther('1');

export const ARCHIVED_VOTE_IPFS_TIMEOUT = 4000;
// 32kb per vote description
export const VOTE_DESCRIPTION_MAX_BYTES = 32_000;

export const VOTE_MODE_MAP: Record<VoteMode, string> = {
  yay: 'Yes',
  nay: 'No',
};
