import { useState } from 'react';
import { SelectorMatch } from './use-selector-lookup';
import { decodeCalls, DecodedCall } from 'utils/decode-evm-script-calls';
import { SimulateTxForm } from './simulate-tx-form';
import {
  Block,
  Option,
  Select,
  Text,
  ToastError,
  trimAddress,
} from '@lidofinance/lido-ui';
import { BlockStyled, CalldataDecoderResultStyled } from './style';
import { Script, ScriptBody } from 'shared/components/evm-script-parsed';
import { DecoderContext } from 'shared/blockchain/utils/abi';
import { Hex } from 'viem';

type Props = {
  isEvmScript: boolean;
  matches: SelectorMatch[];
  decodedCalls: DecodedCall[];
  calldata: Hex;
  decoderContext: DecoderContext;
};

export const CalldataDecoderResult = ({
  isEvmScript,
  matches,
  decodedCalls,
  calldata,
  decoderContext,
}: Props) => {
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0);
  const [displayedCalls, setDisplayedCalls] =
    useState<DecodedCall[]>(decodedCalls);
  const [isDecoding, setIsDecoding] = useState(false);

  const handleSelectedMatchChange = async (index: number) => {
    if (index === selectedMatchIndex) return;
    setSelectedMatchIndex(index);
    setIsDecoding(true);
    try {
      const decoded = await decodeCalls(
        [
          {
            target: matches[index].address,
            payload: calldata,
          },
        ],
        decoderContext,
      );

      setDisplayedCalls(decoded);
    } catch (error) {
      console.error('[calldata-decoder] decode failed', error);
      const message =
        error instanceof Error ? error.message : 'Unable to decode calldata';
      ToastError(message, {});
    } finally {
      setIsDecoding(false);
    }
  };

  if (decodedCalls.length === 0) {
    return (
      <BlockStyled>
        <Text>No matches found for the provided calldata</Text>
      </BlockStyled>
    );
  }

  return (
    <CalldataDecoderResultStyled>
      {matches.length > 1 && (
        <BlockStyled>
          <Text size="sm">
            Selector matches {matches.length} known contracts
          </Text>
          <Select
            label="Matched contract"
            value={selectedMatchIndex}
            disabled={isDecoding}
            onChange={(value) => handleSelectedMatchChange(value as number)}
          >
            {matches.map((match, index) => (
              <Option key={`${match.address}-${match.signature}`} value={index}>
                {`[${match.contractName} ${trimAddress(match.address, 4)}] ${match.signature}`}
              </Option>
            ))}
          </Select>
          {isDecoding && <Text size="xxs">Decoding…</Text>}
        </BlockStyled>
      )}

      {isEvmScript ? (
        <BlockStyled $gapLess>
          <Script
            rawScript={calldata}
            decodedCalls={displayedCalls}
            tabVariant="voting"
          />
        </BlockStyled>
      ) : (
        <>
          <Block paddingLess>
            <ScriptBody calls={displayedCalls} />
          </Block>
          <SimulateTxForm
            calldata={calldata}
            defaultTo={matches[selectedMatchIndex]?.address}
          />
        </>
      )}
    </CalldataDecoderResultStyled>
  );
};
