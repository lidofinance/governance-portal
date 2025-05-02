import {
  Arrow,
  Badge,
  FlowBannerWrapper,
  FlowDescription,
  FlowItem,
  ProposalsWrapper,
} from './style';
import { Text } from 'shared/components/text';
import { FlexWrapper } from 'shared/styled-components';

export const ProposalFlowBanner = () => {
  return (
    <FlowBannerWrapper>
      <Text size={22} weight={600}>
        Proposal Flow in Dual Governance
      </Text>
      <Text color="secondary">
        Minimum time to execution is 72h — but it can be longer if a dynamic
        timelock is triggered
      </Text>
      <ProposalsWrapper>
        <FlowItem>
          <FlexWrapper $alignItems="center">
            <Badge $variant="default">
              <Text color="primary" weight={600}>
                Passed on Aragon
              </Text>
            </Badge>
          </FlexWrapper>
          <FlowDescription size={15} color="secondary">
            LDO quorum reached and proposal approved
          </FlowDescription>
        </FlowItem>
        <Arrow>
          <span></span>
        </Arrow>
        <FlowItem>
          <FlexWrapper $alignItems="center">
            <Badge $variant="warning">
              <Text color="primary" weight={600}>
                Submitted
              </Text>
            </Badge>
          </FlexWrapper>
          <FlowDescription size={15} color="secondary">
            Timelock: 72 hours
            <br />
            Veto power: stETH
          </FlowDescription>
          <FlowDescription size={15} color="secondary"></FlowDescription>
        </FlowItem>
        <Arrow>
          <span></span>
        </Arrow>
        <FlowItem>
          <FlexWrapper $alignItems="center">
            <Badge $variant="default">
              <Text color="primary" weight={600}>
                Execution Scheduled
              </Text>
            </Badge>
          </FlexWrapper>
          <FlowDescription size={15} color="secondary">
            Timelock: 48 hours
            <br />
            Veto power: Emergency committee
          </FlowDescription>
        </FlowItem>
        <Arrow>
          <span></span>
        </Arrow>
        <FlowItem>
          <FlexWrapper $alignItems="center">
            <Badge $variant="success">
              <Text color="primary" weight={600}>
                Executed
              </Text>
            </Badge>
          </FlexWrapper>
          <FlowDescription size={15} color="secondary">
            Execution is permissionless <br />
            after the submission timelock ends
          </FlowDescription>
        </FlowItem>
      </ProposalsWrapper>
    </FlowBannerWrapper>
  );
};
