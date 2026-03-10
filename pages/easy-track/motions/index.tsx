import styled from 'styled-components';
import { Layout } from 'shared/components';
import { Text } from 'shared/components/text';
import { Motions } from '@easy-track/motions';
import { Button } from 'shared/components/button';
import { EASY_TRACK__START_MOTION_PATH } from 'constants/urls';
import Link from 'next/link';

const Title = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MotionsPage = () => {
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
    </Layout>
  );
};

export default MotionsPage;
