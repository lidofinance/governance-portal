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
import { useProposalDelaysQuery } from '../../hooks/use-proposal-timelock';

export const ProposalFlowBanner = () => {
  const { data: delays } = useProposalDelaysQuery({
    enabled: true,
  });

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
            LDO quorum reached <br /> and proposal approved
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
          {delays && (
            <FlowDescription size={15} color="secondary">
              Timelock:{' '}
              {delays.afterSubmitDelay < 3600
                ? `${Math.round(delays.afterSubmitDelay / 60)} minutes`
                : `${Math.round(delays.afterSubmitDelay / 3600)} hours`}
              <br />
              Override: stETH
            </FlowDescription>
          )}
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
          {delays && (
            <FlowDescription size={15} color="secondary">
              Timelock:{' '}
              {delays.afterScheduleDelay < 3600
                ? `${Math.round(delays.afterScheduleDelay / 60)} minutes`
                : `${Math.round(delays.afterScheduleDelay / 3600)} hours`}
              <br />
              Override: Emergency committee
            </FlowDescription>
          )}
        </FlowItem>
        <Arrow>
          <span></span>
        </Arrow>
        <FlowItem>
          <FlexWrapper $alignItems="center">
            <Badge $variant="default">
              <Text color="primary" weight={600}>
                Executed
              </Text>
            </Badge>
          </FlexWrapper>
          <FlowDescription size={15} color="secondary">
            Anyone can execute the proposal <br /> after the scheduled delay
            ends
          </FlowDescription>
        </FlowItem>
      </ProposalsWrapper>
    </FlowBannerWrapper>
  );
};
