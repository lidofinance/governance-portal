import { AddMEVBoostRelaysAbi } from 'generated';
import { NestProps } from './types';

// AddMEVBoostRelays
export function MevBoostRelaysAdd({
  callData,
}: NestProps<AddMEVBoostRelaysAbi['decodeEVMScriptCallData']>) {
  return (
    <>
      {callData.map((item) => {
        return (
          <div key={item.uri}>
            — Add relay <b>{item.operator}</b> with params:
            <ul>
              <li>
                <b>URI:</b> {item.uri};
              </li>
              <li>
                <b>Description:</b> {item.description};
              </li>
              <li>
                <b>Mandatory:</b> {item.is_mandatory ? 'true' : 'false'};
              </li>
            </ul>
          </div>
        );
      })}
    </>
  );
}
