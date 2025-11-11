import { useActiveMotions } from '../hooks/use-motions';
import { MotionCard } from '../motion-card';
import { MotionsGrid } from './style';
import { InlineLoader } from '@lidofinance/lido-ui';

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
        <MotionCard key={motion.id} motion={motion} />
      ))}
    </MotionsGrid>
  );
};
