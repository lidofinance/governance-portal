import { DecodedCall } from 'features/dual-governance/evm-script-parsed/utils/decode-calls';

export const formatDecodedCallString = (decodedCall: DecodedCall) => {
  const { decoded, id, contractAddress } = decodedCall;
  if (!decoded) {
    return 'UNKNOWN CONTRACT';
  }
  const { functionName, args } = decoded;

  const formattedArgs = args?.join(', ');
  return `function ${functionName}( ${formattedArgs} ) Call data: [${id}] ${contractAddress}`;
};
