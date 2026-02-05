import { useState, useMemo } from 'react';
import {
  Tabs,
  Tab,
  VoteScriptBodyWrap,
} from 'features/dual-governance/evm-script-parsed/style';
import { ScriptBody } from 'features/dual-governance/evm-script-parsed/script-body';
import { DecodedCall } from 'utils/decode-evm-script-calls';
import { Hex } from 'viem';

type Props = {
  decodedCalls: DecodedCall[];
  rawScript?: Hex;
  tabVariant?: 'voting' | 'dg';
  metadata?: string;
};

const sanitizeForJSON = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeForJSON);
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'function') {
        continue;
      }
      if (typeof value === 'bigint') {
        sanitized[key] = String(value);
        continue;
      }
      try {
        sanitized[key] = sanitizeForJSON(value);
      } catch (error) {
        sanitized[key] = String(value);
      }
    }
    return sanitized;
  }

  return obj;
};

export const Script = ({
  decodedCalls,
  tabVariant,
  rawScript,
  metadata,
}: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = useMemo(() => {
    const tabMap = {
      Parsed: decodedCalls.length,
      JSON: decodedCalls.length,
      Raw: rawScript?.length,
      ...(metadata ? { Items: metadata } : {}),
    };
    const TabNames = Object.keys(tabMap) as (keyof typeof tabMap)[];
    return TabNames.filter((key) => tabMap[key]);
  }, [decodedCalls.length, metadata, rawScript?.length]);

  const sanitizedCalls = useMemo(() => {
    try {
      return sanitizeForJSON(decodedCalls);
    } catch (error) {
      console.error('Error sanitizing calls for JSON:', error);
      return {
        error: 'Failed to serialize decoded calls',
        calls: decodedCalls.length,
      };
    }
  }, [decodedCalls]);

  return (
    <>
      <Tabs>
        {tabs.map((tab, i) => (
          <Tab
            key={tab}
            $isActive={activeTab === i}
            $variant={tabVariant}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </Tab>
        ))}
      </Tabs>
      <VoteScriptBodyWrap $variant={tabVariant}>
        {tabs[activeTab] === 'JSON' && (
          <ScriptBody binary={JSON.stringify(sanitizedCalls, null, 2)} />
        )}

        {tabs[activeTab] === 'Parsed' && <ScriptBody calls={decodedCalls} />}
        {tabs[activeTab] === 'Raw' && <ScriptBody binary={rawScript} />}
        {tabs[activeTab] === 'Items' && <ScriptBody>{metadata}</ScriptBody>}
      </VoteScriptBodyWrap>
    </>
  );
};
