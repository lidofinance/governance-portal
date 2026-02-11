import { IconWrap, StyledInput } from './style';
import { VoteSearchIcon } from 'shared/components/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { votePage } from 'constants/urls';
import { useRouter } from 'next/router';
import debounce from 'lodash/debounce';

export const VoteSearch = () => {
  const router = useRouter();
  const [voteId, setVoteId] = useState('');

  const changeRoute = useCallback(
    (value: string) => {
      if (value) {
        void router.push(votePage(value));
      }
    },
    [router],
  );

  const debouncedChangeRoute = useMemo(
    () => debounce(changeRoute, 500),
    [changeRoute],
  );

  useEffect(() => {
    return () => {
      debouncedChangeRoute.cancel();
    };
  }, [debouncedChangeRoute]);

  const handleVoteIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setVoteId(value);
      debouncedChangeRoute(value);
    },
    [debouncedChangeRoute],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        debouncedChangeRoute.cancel();
        changeRoute(voteId);
      }
    },
    [changeRoute, debouncedChangeRoute, voteId],
  );

  return (
    <StyledInput
      value={voteId}
      isInteger={true}
      placeholder="DAO vote #"
      onChange={handleVoteIdChange}
      onKeyDown={handleKeyDown}
      leftDecorator={
        <IconWrap>
          <VoteSearchIcon />
        </IconWrap>
      }
    />
  );
};
