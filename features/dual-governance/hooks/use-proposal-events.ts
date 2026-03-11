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
  fetchExecutedEvent,
  fetchScheduledEvent,
  fetchSubmittedEvent,
} from 'utils/proposals/fetch-proposal-events.mjs';
import { fetchCachedEventsData } from '../utils/fetch-cached-events-data';

type Args = {
  proposalDetails?: ProposalDetails;
  fetchExecuted?: boolean; // Avoid fetching the heavy executed event on the main page; use only on proposal page
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
      return (
        !events.proposalSubmittedEvent ||
        !events.proposalScheduledEvent ||
        !events.proposalExecutedEvent
      );
    default:
      return false;
  }
};

export const useProposalEvents = ({ proposalDetails, fetchExecuted }: Args) => {
  const { chainId } = useLidoSDK();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: [
      'proposal-events',
      chainId,
      proposalDetails?.id.toString(),
      proposalDetails?.status,
      fetchExecuted,
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

          if (
            !updatedEvents.proposalExecutedEvent &&
            proposalStatus === ProposalStatus.Executed &&
            fetchExecuted
          ) {
            updatedEvents.proposalExecutedEvent = await fetchExecutedEvent(
              proposalDetails,
              publicClient,
              chainId,
            );
          }

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
