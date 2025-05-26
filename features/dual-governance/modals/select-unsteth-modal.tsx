import { useCallback, useState } from 'react';
import { ModalProps } from '@lidofinance/lido-ui';
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
import { RageQuitEscrowUnstETHRecord } from '../utils';

type Props = {
  onConfirm: (selectedNftIds?: string[]) => Promise<void | boolean>;
  actionLabel: string;
  unstETHRecords: Omit<
    RageQuitEscrowUnstETHRecord,
    'claimableAmount' | 'status'
  >[];
} & ModalProps;

export const SelectUnstEthModal = (props: Props) => {
  const { actionLabel, unstETHRecords, onConfirm, ...modalProps } = props;
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, true | undefined>
  >(() => {
    return unstETHRecords.reduce<Record<string, true | undefined>>(
      (acc, item) => {
        acc[String(item.id)] = true;
        return acc;
      },
      {},
    );
  });

  const selectedOptionsArray = Object.keys(selectedOptions);

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
    if (!unstETHRecords) return;

    if (Object.keys(selectedOptions).length === unstETHRecords.length) {
      setSelectedOptions({});
    } else {
      const newState = unstETHRecords.reduce<Record<string, true | undefined>>(
        (acc, item) => {
          acc[String(item.id)] = true;
          return acc;
        },
        {},
      );
      setSelectedOptions(newState);
    }
  }, [unstETHRecords, selectedOptions]);

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

        <NftList>
          {unstETHRecords?.map(({ id, shares }) => (
            <NftMultiselectItem
              selectable
              key={id}
              id={String(id)}
              stEthAmount={shares}
              checked={selectedOptions[String(id)]}
              onClick={handleSelect(String(id))}
            />
          ))}
        </NftList>
        <RevokeModalControls>
          <Button
            fullwidth
            onClick={() => onConfirm(selectedOptionsArray)}
            disabled={selectedOptionsArray.length === 0}
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
