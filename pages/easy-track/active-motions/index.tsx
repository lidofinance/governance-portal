import { Layout } from 'shared/components';
import { Text } from 'shared/components/text';
import { Motions } from 'features/easy-track/motions/motions';
import { Title } from 'features/easy-track/style';

const ActiveMotionsPage = () => {
  return (
    <Layout containerSize="full">
      <Title>
        <Text size={24} strong>
          Active Motions
        </Text>
        <Text color="secondary" size={12}>
          Select the card to see details
        </Text>
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
