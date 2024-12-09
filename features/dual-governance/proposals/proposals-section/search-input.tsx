import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
import { SearchIcon } from 'shared/components/icons';
import { SearchInputWrapper, StyledSearchInput } from './style';

export const SearchInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const router = useRouter();

  useEffect(() => {
    const searchValue = router.query?.proposalId as string;
    if (searchValue && searchValue !== debouncedValue) {
      setDebouncedValue(searchValue);
      setInputValue(searchValue);
    }
  }, [router.query, debouncedValue]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        await router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, proposalId: value },
          },
          undefined,
          { shallow: true },
        );
      }, 500),
    [router],
  );

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setInputValue(value);
    await debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <SearchInputWrapper>
      <StyledSearchInput
        value={inputValue}
        onChange={handleSearch}
        leftDecorator={<SearchIcon />}
        placeholder="Search proposal by number"
        type="search"
      />
    </SearchInputWrapper>
  );
};
