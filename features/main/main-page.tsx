import { Chip } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import { Layout } from 'shared/components';
import {
  AragonIcon,
  DualGovernanceIcon,
  LidoBlueIcon,
  ExternalLinkIcon,
  SnapshotIcon,
  DiscordIcon,
  TelegramIcon,
} from 'shared/components/icons';

import { DelegateCta } from './delegate-cta';
import { ActionCard } from './action-card';
import { AppsWrapper, ProposalsWrapper, ResourcesWrapper } from './style';
import { Box } from '../../shared/components/box';
import { ResourceCard } from './resource-card';

const InDgReviewAddon = ({ proposalId }: { proposalId: number }) => {
  return (
    <Box border="1px solid #1312171A" padding="4px 8px" borderRadius="60px">
      <Text size={16} strong color="secondary">
        # {proposalId} in review
      </Text>
    </Box>
  );
};

export const MainPage = () => {
  return (
    <Layout>
      <Text size={40}>Governance Actions</Text>
      <DelegateCta />
      <AppsWrapper>
        <ActionCard
          icon={<SnapshotIcon />}
          addon={<Chip variant="positive">Live</Chip>}
          title={
            <Text size={28}>
              Offchain <ExternalLinkIcon />
            </Text>
          }
          description={
            <Text size={16} color="secondary">
              Vote to signal your support or opposition to proposals
            </Text>
          }
        />
        <ActionCard
          icon={<AragonIcon />}
          addon={<Chip variant="positive">Live</Chip>}
          title={<Text size={28}>Onchain</Text>}
          description={
            <Text size={16} color="secondary">
              Approve or reject execution of the protocol changes
            </Text>
          }
        />
        <ActionCard
          icon={<DualGovernanceIcon />}
          addon={<InDgReviewAddon proposalId={12} />}
          title={<Text size={28}>Dual Governance</Text>}
          description={
            <Text size={16} color="secondary">
              Review and oppose LDO-governance decisions as a stETH holder
            </Text>
          }
        />
        <ActionCard
          icon={<LidoBlueIcon />}
          addon={<Chip variant="positive">Live</Chip>}
          title={<Text size={28}>Easy Tracks</Text>}
          description={
            <Text size={16} color="secondary">
              Initiate and review optimistic governance motions
            </Text>
          }
        />
      </AppsWrapper>
      <Text size={40} weight={500}>
        Proposals & Discussion
      </Text>
      <ProposalsWrapper>
        <ActionCard
          icon={<LidoBlueIcon />}
          title={
            <Text size={28}>
              Research Forum <ExternalLinkIcon />
            </Text>
          }
          description={
            <Text size={16} color="secondary">
              Explore proposals, share feedback, or draft your own
            </Text>
          }
        />
        <ActionCard
          icon={<DiscordIcon />}
          title={
            <Text size={28}>
              Discord channel <ExternalLinkIcon />
            </Text>
          }
          description={
            <Text size={16} color="secondary">
              Ask questions and stay tuned for the latest governance updates
            </Text>
          }
        />
        <ActionCard
          icon={<TelegramIcon />}
          title={
            <Text size={28}>
              Telegram group <ExternalLinkIcon />
            </Text>
          }
          description={
            <Text size={16} color="secondary">
              Ask questions and stay tuned for the latest governance updates
            </Text>
          }
        />
      </ProposalsWrapper>
      <Text size={40} weight={500}>
        Resources
      </Text>
      <ResourcesWrapper>
        <ResourceCard title="Lido DAO Bot" />
        <ResourceCard title="Governance stack" />
        <ResourceCard title="Governance calendar" />
        <ResourceCard title="Documentation" />
        <ResourceCard title="Guides" />
      </ResourcesWrapper>
    </Layout>
  );
};
