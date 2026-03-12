import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import {
  CachedEventsData,
  EventsLogs,
  ProposalDetails,
  ProposalStatus,
} from '../proposals/types';
import { usePublicClient } from 'wagmi';
import {
  fetchScheduledEvent,
  fetchSubmittedEvent,
} from 'utils/proposals/fetch-proposal-events.mjs';
import { fetchCachedEventsData } from '../utils/fetch-cached-events-data';

type Args = {
  proposalDetails?: ProposalDetails;
};

const isEventMissing = (
  proposalDetails: ProposalDetails,
  events: Partial<EventsLogs>,
): boolean => {
  switch (proposalDetails.status) {
    case ProposalStatus.Submitted:
      return !events.proposalSubmittedEvent;
    case ProposalStatus.Scheduled:
      return !events.proposalSubmittedEvent || !events.proposalScheduledEvent;
    case ProposalStatus.Executed:
      // proposalExecutedEvent is only populated by the build script, not at runtime
      return !events.proposalSubmittedEvent || !events.proposalScheduledEvent;
    default:
      return false;
  }
};

export const useProposalEvents = ({ proposalDetails }: Args) => {
  const { chainId } = useLidoSDK();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: [
      'proposal-events',
      chainId,
      proposalDetails?.id.toString(),
      proposalDetails?.status,
    ],
    queryFn: async () => {
      if (!proposalDetails || !publicClient) {
        return {
          proposalSubmittedEvent: null,
          proposalScheduledEvent: null,
          proposalExecutedEvent: null,
        };
      }

      const eventsData: CachedEventsData = await fetchCachedEventsData();

      const proposalStatus = proposalDetails.status;
      const chainData = eventsData[chainId.toString()];
      const proposalData = chainData?.proposals[proposalDetails.id.toString()];

      const events: EventsLogs = {
        proposalSubmittedEvent: proposalData?.proposalSubmittedEvent ?? null,
        proposalScheduledEvent: proposalData?.proposalScheduledEvent ?? null,
        proposalExecutedEvent: proposalData?.proposalExecutedEvent ?? null,
      };

      if (isEventMissing(proposalDetails, events)) {
        try {
          const updatedEvents = { ...events };

          if (!updatedEvents.proposalSubmittedEvent) {
            updatedEvents.proposalSubmittedEvent = await fetchSubmittedEvent(
              proposalDetails,
              publicClient,
              chainId,
            );
          }

          if (
            !updatedEvents.proposalScheduledEvent &&
            proposalStatus !== ProposalStatus.Submitted
          ) {
            updatedEvents.proposalScheduledEvent = await fetchScheduledEvent(
              proposalDetails,
              publicClient,
              chainId,
            );
          }

          // fetchExecutedEvent scans from scheduledAt to current block (potentially
          // millions of blocks). This is only safe to run in the build script, not
          // at runtime. If the event is missing from the cache, we skip it here —
          // the build script will populate it on the next run.

          return updatedEvents;
        } catch (error) {
          console.error('Failed to fetch proposal events', error);
          throw error;
        }
      }

      return events;
    },
    staleTime: 30000,
    enabled: !!proposalDetails,
  });
};
