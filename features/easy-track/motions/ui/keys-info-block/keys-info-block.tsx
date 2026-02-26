import { useCallback, ComponentProps } from 'react';

import { Block, Button } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import { Row, Col, ColValue, ErrorMessageWrap } from './style';

type ErrorMessageProps = {
  error: string;
};

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  return (
    <ErrorMessageWrap>
      {error} found! Please, refrain from submitting new keys or starting
      motions to increase the limit and contact @team-nom in Discord immediately
    </ErrorMessageWrap>
  );
};

type TextColor = ComponentProps<typeof Text>['color'];

const getKeysColor = (
  keys: string[] | undefined,
  defaultColor?: TextColor,
): TextColor => {
  if (!keys) {
    return 'warning';
  }
  if (keys.length > 0) {
    return 'error';
  }
  return defaultColor ?? 'default';
};

type Props = {
  invalidKeys: string[] | undefined;
  duplicateKeys: string[] | undefined;
  usedSigningKeys: number;
  totalSigningKeys: number;
};

export const KeysInfoBlock = ({
  invalidKeys,
  duplicateKeys,
  usedSigningKeys,
  totalSigningKeys,
}: Props) => {
  const hasInvalid = !!invalidKeys?.length;
  const hasDuplicates = !!duplicateKeys?.length;

  const handleClickContact = useCallback(() => {
    window.open(
      'https://discord.com/channels/761182643269795850/892403983925256212',
      '_blank',
    );
  }, []);

  return (
    <>
      <Block>
        <Row>
          <Col>
            <ColValue>
              <Text as="span" size={18} weight={800}>
                {usedSigningKeys}
              </Text>
              <Text as="span" color="secondary" size={18} weight={800}>
                {' '}
                / {totalSigningKeys}
              </Text>
            </ColValue>
            <Text color="secondary" size={12} weight={500}>
              Keys used
            </Text>
          </Col>

          <Col>
            <ColValue>
              <Text
                as="span"
                size={18}
                weight={800}
                color={getKeysColor(invalidKeys)}
              >
                {invalidKeys?.length ?? 'N/A'}
              </Text>
            </ColValue>
            <Text
              size={12}
              weight={500}
              color={getKeysColor(invalidKeys, 'secondary')}
            >
              Invalid signatures
            </Text>
          </Col>

          <Col>
            <ColValue>
              <Text
                as="span"
                size={18}
                weight={800}
                color={getKeysColor(duplicateKeys)}
              >
                {duplicateKeys?.length ?? 'N/A'}
              </Text>
            </ColValue>
            <Text
              size={12}
              weight={500}
              color={getKeysColor(duplicateKeys, 'secondary')}
            >
              Duplicate keys
            </Text>
          </Col>
        </Row>

        {hasInvalid && <ErrorMessage error="Invalid keys" />}
        {hasDuplicates && <ErrorMessage error="Duplicate keys" />}
      </Block>

      {(hasInvalid || hasDuplicates) && (
        <>
          <br />
          <Button fullwidth onClick={handleClickContact}>
            Contact in Discord
          </Button>
        </>
      )}

      <br />
    </>
  );
};
