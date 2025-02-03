import { useCallback, useMemo, useRef, useState } from 'react';
import {
  NftMultiselectInput,
  PopupHeader,
  PopupMenuStyled,
  PopupSelectAllButton,
} from './style';
import { Text } from 'shared/components/text';
import { NftMultiselectItem } from './nft-multiselect-item';
import { NftMultiselectProps, NftMultiselectValuesMap } from './types';
import { ArrowDown } from 'shared/components/icons';
import { useClickOutside } from 'shared/hooks/use-click-outside';

export const NftMultiselect = (props: NftMultiselectProps) => {
  const { options, selectedOptions, onChange, disabled = false } = props;

  const optionsArray = useMemo(() => {
    if (!options) return [];

    return Object.keys(options).map((id) => ({
      id,
      stEthAmount: options[id],
    }));
  }, [options]);

  const handleChange = useCallback(
    (value: string) => () => {
      if (!selectedOptions[value]) {
        onChange({ ...selectedOptions, [value]: true });
      } else {
        const { [value]: _, ...rest } = selectedOptions;
        onChange(rest);
      }
    },
    [onChange, selectedOptions],
  );

  const handleSelectAll = useCallback(() => {
    if (Object.keys(selectedOptions).length === optionsArray.length) {
      onChange({});
    } else {
      const newState = optionsArray.reduce<NftMultiselectValuesMap>(
        (acc, item) => {
          acc[item.id] = true;
          return acc;
        },
        {},
      );
      onChange(newState);
    }
  }, [optionsArray, onChange, selectedOptions]);

  const stringValue = useMemo(
    () =>
      Object.keys(selectedOptions)
        .map((id) => `#${id}`)
        .join(', '),
    [selectedOptions],
  );

  const anchorRef = useRef<HTMLLabelElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  useClickOutside(popupRef, null, () => setPopupOpen(false));

  return (
    <div>
      <NftMultiselectInput
        readOnly
        wrapperRef={anchorRef}
        value={stringValue}
        label="Select NFTs"
        onClick={() => setPopupOpen(true)}
        rightDecorator={<ArrowDown />}
        disabled={disabled}
      />
      <PopupMenuStyled
        ref={popupRef}
        anchorRef={anchorRef}
        open={isPopupOpen}
        style={{ width: anchorRef.current?.clientWidth }}
      >
        <PopupHeader>
          <Text>Select NFTs</Text>
          <PopupSelectAllButton onClick={handleSelectAll}>
            Select All
          </PopupSelectAllButton>
        </PopupHeader>
        {optionsArray.map((option) => (
          <NftMultiselectItem
            key={option.id}
            id={option.id}
            stEthAmount={option.stEthAmount}
            onClick={handleChange(option.id)}
            checked={selectedOptions[option.id]}
          />
        ))}
      </PopupMenuStyled>
    </div>
  );
};
