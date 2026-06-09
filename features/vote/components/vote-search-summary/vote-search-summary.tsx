import { pluralize } from 'utils/pluralize';
import { SearchSummary, SearchSummaryQuery, ClearFilterButton } from './style';

type Props = {
  count: number;
  query: string;
  onClear: () => void;
};

export const VoteSearchSummary = ({ count, query, onClear }: Props) => (
  <SearchSummary>
    <span>
      {pluralize(count, 'result')} found for{' '}
      <SearchSummaryQuery>“{query}”</SearchSummaryQuery>
    </span>
    <ClearFilterButton onClick={onClear}>Clear filter</ClearFilterButton>
  </SearchSummary>
);
