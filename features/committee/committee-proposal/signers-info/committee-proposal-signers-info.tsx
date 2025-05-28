import { AragonLogo, ExternalLinkIcon } from 'shared/components/icons';

import {
  SignersInfoWrapper,
  SignersInfoSummary,
  SignersInfoSummaryText,
  VoteStates,
  VoteState,
  SignersList,
  SignerInfo,
  SignerLogoWrapper,
  SignerVoteState,
  SignerVoteLink,
} from './style';
import { Address } from '@lidofinance/lido-ui';

const signersMock = [
  {
    logo: <AragonLogo />,
    name: 'Aave DAO',
    address: '0xFaa1692c6eea8eeF534e7819749aD93a1420379A',
  },
  {
    logo: <AragonLogo />,
    name: 'CoW Swap DAO',
    address: '0xFaa1692c6eea8eeF534e7819749aD93a1420379A',
    voteState: 'yea',
    txHash: '0xFaa1692c6eea8eeF534e78,',
  },
  {
    logo: <AragonLogo />,
    name: 'MakerDAO',
    address: '0xFaa1692c6eea8eeF534e7819749aD93a1420379A',
    voteState: 'nay',
    txHash: '0xFaa1692c6eea8eeF534e78,',
  },
  {
    logo: <AragonLogo />,
    name: 'Balancer DAO',
    address: '0xFaa1692c6eea8eeF534e7819749aD93a1420379A',
    voteState: 'yea',
    txHash: '0xFaa1692c6eea8eeF534e78,',
  },
  {
    logo: <AragonLogo />,
    name: 'Uniswap DAO',
    address: '0xFaa1692c6eea8eeF534e7819749aD93a1420379A',
    voteState: 'yea',
    txHash: '0xFaa1692c6eea8eeF534e78,',
  },
];

export const CommitteeProposalSignersInfo = () => {
  return (
    <SignersInfoWrapper>
      <SignersInfoSummary>
        <SignersInfoSummaryText color="default" strong>
          Signers
        </SignersInfoSummaryText>
        <VoteStates>
          <SignersInfoSummaryText>
            Yes <VoteState>3 of 4</VoteState>
          </SignersInfoSummaryText>
          <SignersInfoSummaryText>
            No <VoteState>1 of 3</VoteState>
          </SignersInfoSummaryText>
        </VoteStates>
      </SignersInfoSummary>
      <SignersList>
        {signersMock.map((signer) => (
          <SignerInfo key={signer.name}>
            <SignerLogoWrapper>
              {signer.logo}
              <SignersInfoSummaryText>{signer.name}</SignersInfoSummaryText>
            </SignerLogoWrapper>
            <Address address={signer.address} symbols={4} />
            {!signer.voteState && <SignerVoteState>&mdash;</SignerVoteState>}
            {signer.voteState && (
              <SignerVoteState>
                {signer.voteState === 'yea' ? 'Yes' : 'No'}
                <SignerVoteLink href={signer.txHash || '#'}>
                  <ExternalLinkIcon />
                </SignerVoteLink>
              </SignerVoteState>
            )}
          </SignerInfo>
        ))}
      </SignersList>
    </SignersInfoWrapper>
  );
};
