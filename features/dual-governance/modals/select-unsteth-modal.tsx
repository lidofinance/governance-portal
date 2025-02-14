import { useCallback, useState } from 'react';
import { Loader, ModalProps } from '@lidofinance/lido-ui';
import {
  NftList,
  RevokeModalControls,
  RevokeModalHeader,
  RevokeModalWrapper,
  SelectAllButton,
  StyledModal,
} from './style';
import { Button } from 'shared/components/button';
import { NftMultiselectItem } from '../nft-multiselect';
import { Text } from 'shared/components/text';
import { useEscrowUnstethBalance } from '../hooks/use-escrow-unsteth-balance';

type Props = {
  onConfirm: (selectedNftIds?: string[]) => Promise<void | boolean>;
  actionLabel: string;
} & ModalProps;

export const SelectUnstEthModal = (props: Props) => {
  const { actionLabel, onConfirm, ...modalProps } = props;
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, true | undefined>
  >({});

  const selectedOptionsArray = Object.keys(selectedOptions);

  const { data: unstEthItems, isLoading } = useEscrowUnstethBalance();

  const handleSelect = useCallback(
    (value: string) => () => {
      if (!selectedOptions[value]) {
        setSelectedOptions({ ...selectedOptions, [value]: true });
      } else {
        const { [value]: _, ...rest } = selectedOptions;
        setSelectedOptions(rest);
      }
    },
    [selectedOptions],
  );

  const handleSelectAll = useCallback(() => {
    if (!unstEthItems) return;

    if (Object.keys(selectedOptions).length === unstEthItems.length) {
      setSelectedOptions({});
    } else {
      const newState = unstEthItems.reduce<Record<string, true | undefined>>(
        (acc, item) => {
          acc[item.id] = true;
          return acc;
        },
        {},
      );
      setSelectedOptions(newState);
    }
  }, [unstEthItems, selectedOptions]);

  return (
    <StyledModal {...modalProps}>
      <RevokeModalWrapper>
        <RevokeModalHeader>
          <Text size={28} weight={500}>
            Select NFTs to {actionLabel}
          </Text>
          <SelectAllButton onClick={handleSelectAll}>
            Select all
          </SelectAllButton>
        </RevokeModalHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <NftList>
            {unstEthItems?.map(({ id, stEthAmount }) => (
              <NftMultiselectItem
                selectable
                key={id}
                id={id}
                stEthAmount={stEthAmount}
                checked={selectedOptions[id]}
                onClick={handleSelect(id)}
              />
            ))}
          </NftList>
        )}
        <RevokeModalControls>
          <Button
            fullwidth
            onClick={() => onConfirm(selectedOptionsArray)}
            disabled={selectedOptionsArray.length === 0}
            loading={isLoading}
          >
            {actionLabel}
          </Button>
          <Button fullwidth variant="outlined" onClick={props.onClose}>
            Close
          </Button>
        </RevokeModalControls>
      </RevokeModalWrapper>
    </StyledModal>
  );
};
