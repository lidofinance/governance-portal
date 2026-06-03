import { SearchSummary, SearchSummaryQuery, ClearFilterButton } from './style';

type Props = {
  count: number;
  query: string;
  onClear: () => void;
};

export const VoteSearchSummary = ({ count, query, onClear }: Props) => (
  <SearchSummary>
    <span>
      {count} {count === 1 ? 'result' : 'results'} found for{' '}
      <SearchSummaryQuery>“{query}”</SearchSummaryQuery>
    </span>
    <ClearFilterButton onClick={onClear}>Clear filter</ClearFilterButton>
  </SearchSummary>
);
