import { PropsWithChildren, useCallback } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { ReactComponent as UnstethIcon } from 'assets/icons/tokens/unsteth.svg';
import { useSimpleReducer } from '/shared/hooks/useSimpleReducer';
import {
  Wrapper,
  ItemsList,
  Item,
  Amount,
  StyledCheckbox,
  ActionsWrapper,
} from './style';

type NftData = {
  id: string | number;
  amount: number;
};

type Props = {
  items: NftData[];
  selectable?: boolean;
};

export const RevokeClaimNft: React.FC = ({
  items,
  children,
}: PropsWithChildren<Props>) => {
  const initialCheckedItems = items.reduce((acc, item) => {
    acc[item.id] = false;
    return acc;
  }, {});

  const [checkedItems, dispatch] =
    useSimpleReducer<Record<NftData['id'], boolean>>(initialCheckedItems);

  const handleCheckboxChange = useCallback(
    (id: NftData['id'], isChecked: boolean) => {
      dispatch({
        [id]: Boolean(isChecked),
      });
    },
    [dispatch],
  );

  return (
    <Wrapper>
      <Text size="md" strong>
        Select NFTs to claim
      </Text>
      <ItemsList>
        {items.map((item) => {
          return (
            <Item key={item.id}>
              <StyledCheckbox
                checked={checkedItems[item.id]}
                onChange={(e) =>
                  handleCheckboxChange(item.id, e.target.checked)
                }
              />
              <UnstethIcon />
              <Text strong>#{item.id}</Text>
              <Amount>{item.amount}</Amount>
            </Item>
          );
        })}
      </ItemsList>
      <ActionsWrapper>{children}</ActionsWrapper>
    </Wrapper>
  );
};
