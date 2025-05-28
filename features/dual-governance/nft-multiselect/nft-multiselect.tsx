import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const {
    options,
    selectedOptions,
    onChange,
    disabled = false,
    selectable = false,
  } = props;

  const optionsArray = useMemo(() => {
    if (!options) return [];
    return Object.keys(options).map((id) => ({
      id,
      stEthAmount: options[id],
    }));
  }, [options]);

  const initialSelectAllDone = useRef(false);

  useEffect(() => {
    if (optionsArray.length > 0 && !initialSelectAllDone.current && !disabled) {
      const currentSelectedKeys = Object.keys(selectedOptions || {});
      const isAlreadyFullySelected =
        optionsArray.length === currentSelectedKeys.length &&
        optionsArray.every((opt) => currentSelectedKeys.includes(opt.id));

      if (!isAlreadyFullySelected) {
        const allSelectedState = optionsArray.reduce<NftMultiselectValuesMap>(
          (acc, item) => {
            acc[item.id] = true;
            return acc;
          },
          {},
        );
        onChange(allSelectedState);
      }

      initialSelectAllDone.current = true;
    }
  }, [optionsArray, onChange, disabled, selectedOptions]);

  const handleSelectAll = useCallback(() => {
    const currentSelectedLength = Object.keys(selectedOptions || {}).length;

    if (currentSelectedLength === optionsArray.length) {
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

  const handleChange = useCallback(
    (value: string) => () => {
      const currentSelection = selectedOptions || {};
      let newSelection: NftMultiselectValuesMap;

      if (!currentSelection[value]) {
        newSelection = { ...currentSelection, [value]: true };
      } else {
        const { [value]: _, ...rest } = currentSelection;
        newSelection = rest;
      }
      onChange(newSelection);
    },
    [onChange, selectedOptions],
  );

  const stringValue = useMemo(
    () =>
      Object.keys(selectedOptions || {})
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
        onClick={() => !disabled && setPopupOpen(true)}
        rightDecorator={<ArrowDown />}
        disabled={disabled}
        $isOpen={isPopupOpen}
      />
      <PopupMenuStyled
        ref={popupRef}
        anchorRef={anchorRef}
        open={isPopupOpen}
        style={{ width: anchorRef.current?.clientWidth }}
      >
        <PopupHeader>
          <Text>Select NFTs</Text>
          {optionsArray.length > 0 && (
            <PopupSelectAllButton onClick={handleSelectAll} disabled={disabled}>
              {Object.keys(selectedOptions || {}).length === optionsArray.length
                ? 'Deselect All'
                : 'Select All'}
            </PopupSelectAllButton>
          )}
        </PopupHeader>
        {optionsArray.map((option) => (
          <NftMultiselectItem
            key={option.id}
            id={option.id}
            stEthAmount={option.stEthAmount}
            onClick={handleChange(option.id)}
            checked={!!(selectedOptions && selectedOptions[option.id])}
            selectable={selectable}
          />
        ))}
        {optionsArray.length === 0 && !disabled && (
          <div style={{ padding: '10px', textAlign: 'center' }}>
            <Text color="secondary">No NFTs available.</Text>
          </div>
        )}
        {optionsArray.length === 0 && disabled && (
          <div style={{ padding: '10px', textAlign: 'center' }}>
            <Text color="secondary">Loading or no NFTs...</Text>
          </div>
        )}
      </PopupMenuStyled>
    </div>
  );
};
