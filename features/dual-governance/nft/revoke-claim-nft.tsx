import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Text } from '@lidofinance/lido-ui';
import { useSimpleReducer } from 'shared/hooks';
import { NftData } from './types';
import { NftItem } from './nft-item';

import {
  Wrapper,
  NftItemsList,
  ActionsWrapper,
  SelectAllWrapper,
  SelectAllButton,
} from './style';

type Props = {
  items: NftData[];
  selectable?: boolean;
  showSelectAll?: boolean;
  initialChecked?: string;
  callback?: (selected: string[]) => void;
};

const adjustPopupStyles = (node: HTMLElement) => {
  node.style.background = 'transparent';
  node.style.boxShadow = 'none';
  node.style.marginTop = '8px';
};

const parseStringValue = (value: string | undefined): string[] => {
  if (!value) return [];
  return value.split(',').map((value) => value.replace(' #', ''));
};

// TODO: split into 2 components selectable | non-selectable
export const RevokeClaimNft = ({
  items,
  selectable,
  callback,
  showSelectAll,
  initialChecked,
  children,
}: PropsWithChildren<Props>) => {
  const wrapperRef = useRef(null);

  const parsedInitialChecked = useMemo(
    () => (selectable ? parseStringValue(initialChecked) : []),
    [selectable, initialChecked],
  );

  const initialCheckedItems = useMemo(() => {
    if (!selectable) return {};
    return items.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.id] = parsedInitialChecked.includes(String(item.id));
      return acc;
    }, {});
  }, [selectable, items, parsedInitialChecked]);

  const [checkedItems, dispatch] =
    useSimpleReducer<Record<NftData['id'], boolean>>(initialCheckedItems);

  useEffect(() => {
    if (selectable) {
      dispatch(initialCheckedItems);
    }
  }, [selectable, initialCheckedItems, dispatch]);

  useEffect(() => {
    if (wrapperRef.current) {
      const node = wrapperRef.current as Node;
      const parentNode = node.parentNode;

      if (parentNode) {
        adjustPopupStyles(parentNode as HTMLElement);
      }
    }
  }, []);

  useEffect(() => {
    if (selectable && callback) {
      const selectedIds = Object.entries(checkedItems)
        .filter(([_, checked]) => checked)
        .map(([id]) => String(id));

      callback(selectedIds);
    }
  }, [selectable, checkedItems, callback]);

  const handleCheckboxChange = useCallback(
    (id: NftData['id'], isChecked: boolean) => {
      if (selectable) {
        dispatch({
          [id]: Boolean(isChecked),
        });
      }
    },
    [selectable, dispatch],
  );

  const handleSelectAll = useCallback(() => {
    if (selectable) {
      const allChecked = Object.values(checkedItems).every((item) => item);
      const newState = items.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = !allChecked;
        return acc;
      }, {});
      dispatch(newState);
    }
  }, [selectable, items, checkedItems, dispatch]);

  return (
    <Wrapper ref={wrapperRef}>
      <NftItemsList>
        {showSelectAll && (
          <SelectAllWrapper>
            <Text color="secondary">Select NFTs</Text>
            <SelectAllButton onClick={handleSelectAll}>
              Select All
            </SelectAllButton>
          </SelectAllWrapper>
        )}
        {items.map((item) => {
          return (
            <NftItem
              nft={item}
              checked={checkedItems[item.id]}
              selectable={selectable}
              onChange={handleCheckboxChange}
              key={item.id}
            />
          );
        })}
      </NftItemsList>
      <ActionsWrapper>{children}</ActionsWrapper>
    </Wrapper>
  );
};
