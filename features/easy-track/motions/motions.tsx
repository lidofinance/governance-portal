import { useActiveMotions } from '../hooks/use-motions';
import { MotionCard } from '../motion-card';
import { MotionsGrid } from './style';
import { InlineLoader, Link } from '@lidofinance/lido-ui';
import { motionPage } from 'constants/urls';

export const Motions = () => {
  const { data: motions, isLoading } = useActiveMotions();

  if (isLoading) {
    return <InlineLoader />;
  }

  if (!motions || motions.length === 0) {
    return <div>No active motions at the moment</div>;
  }

  return (
    <MotionsGrid>
      {motions.map((motion) => (
        <Link
          target="_self"
          href={motionPage(motion.id.toString())}
          key={motion.id.toString()}
        >
          <MotionCard key={motion.id} motion={motion} />
        </Link>
      ))}
    </MotionsGrid>
  );
};
