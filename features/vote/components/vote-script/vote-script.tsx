import { useDecodedScript } from 'shared/hooks';
import { Script } from 'features/dual-governance/evm-script-parsed';

type Props = {
  script: string;
};
export const VoteScript = ({ script }: Props) => {
  const { decoded } = useDecodedScript(script);
  return <Script rawCalls={decoded?.calls || []} />;
};
