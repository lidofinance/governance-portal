import { memo } from 'react';
import { Text } from 'shared/components/text';
import styled from 'styled-components';

const Wrap = styled.div`
  text-align: center;
`;

const Title = styled(Text).attrs({
  size: 24,
})`
  margin-top: ${({ theme }) => theme.spaceMap.xl}px;
  font-weight: 500;
  text-align: center;
`;

const Description = styled(Text).attrs({
  size: 14,
  color: 'secondary',
})`
  margin-top: ${({ theme }) => theme.spaceMap.xs}px;
  text-align: center;
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
`;

const FooterHint = styled(Text).attrs({
  size: 14,
  color: 'secondary',
})`
  text-align: center;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
`;

type TransactionModalContentProps = {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  footerHint?: React.ReactNode;
  footer?: React.ReactNode;
};

export const TransactionModalContent = memo(
  (props: TransactionModalContentProps) => {
    const { icon, title, description, footerHint, footer } = props;

    return (
      <Wrap data-testid="txStage">
        {icon}
        <Title data-testid="title">{title}</Title>
        <Description data-testid="description">{description}</Description>
        {footerHint && (
          <FooterHint data-testid="footerHint">{footerHint}</FooterHint>
        )}
        {footer && <Footer data-testid="footer">{footer}</Footer>}
      </Wrap>
    );
  },
);
