import { Layout } from 'shared/components';
import { Text } from 'shared/components/text';
import { Motions } from 'features/easy-track/motions';
import { Title } from 'features/easy-track/style';
import { Button } from 'shared/components/button';
import { EASY_TRACK__START_MOTION_PATH } from 'constants/urls';
import Link from 'next/link';

const ActiveMotionsPage = () => {
  return (
    <Layout containerSize="full">
      <Title>
        <Text size={26} weight={700}>
          All motions
        </Text>
        <Link href={EASY_TRACK__START_MOTION_PATH}>
          <Button variant="outlined" size="sm">
            Start Motion
          </Button>
        </Link>
      </Title>
      <Motions />
      {/*{initialLoading && <PageLoader />}*/}
      {/*{!initialLoading && (!activeMotions || activeMotions.length === 0) && (*/}
      {/*  <Text size={16} weight={500} isCentered color="textSecondary">*/}
      {/*    No active motions at the moment*/}
      {/*  </Text>*/}
      {/*)}*/}
      {/*{!initialLoading && activeMotions && activeMotions.length > 0 && (*/}
      {/*  <MotionsGrid>*/}
      {/*    {activeMotions.map((motion) => (*/}
      {/*      <MotionCardPreview key={motion.id} motion={motion} />*/}
      {/*    ))}*/}
      {/*  </MotionsGrid>*/}
      {/*)}*/}
    </Layout>
  );
};

export default ActiveMotionsPage;
