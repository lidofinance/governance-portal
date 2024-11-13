import { useDecodedScript } from 'shared/hooks';
import { ScriptBody } from './script-body';

type Props = {
  script: string;
  metadata?: string;
};

export const Script = ({ script, metadata }: Props) => {
  const { decoded } = useDecodedScript(script);

  return (
    <ScriptBody
      binary={JSON.stringify(decoded, null, 2)}
      decoded={decoded}
      metadata={metadata}
    />
  );
};
