import { Token } from 'shared/blockchain/types';

export type RevocableToken = Exclude<Token, typeof Token.unstETH>;
