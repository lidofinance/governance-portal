import {
  BurgerLine,
  NavBurgerStyled,
  NavBurgerWrap,
  NavItem,
  NavMobileActions,
  NavMobileItem,
  NavMobileStyled,
  NavMobileWrapper,
  NavStyled,
} from './style';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const Nav = () => {
  const { asPath } = useRouter();

  return (
    <NavStyled>
      <NavItem
        $isActive={
          asPath.startsWith('/vote') && !asPath.startsWith('/vote/delegation')
        }
      >
        <Link href="/vote" passHref>
          On-chain Voting
        </Link>
      </NavItem>
      <NavItem $isActive={asPath.startsWith('/vote/delegation')}>
        <Link href="/vote/delegation" passHref>
          Delegation
        </Link>
      </NavItem>
      <NavItem $isActive={asPath.startsWith('/governance')}>
        <Link href="/governance" passHref>
          Dual Governance
        </Link>
      </NavItem>
      <NavItem $isActive={asPath.startsWith('/easy-track')}>
        <Link href="/easy-track">Easy Track</Link>
      </NavItem>
    </NavStyled>
  );
};

export const NavBurger = ({
  isOpened,
  onClick,
}: {
  isOpened: boolean;
  onClick: () => void;
}) => {
  return (
    <NavBurgerStyled onClick={onClick} $isOpened={isOpened}>
      <NavBurgerWrap $isOpened={isOpened}>
        <BurgerLine />
        <BurgerLine />
        <BurgerLine />
      </NavBurgerWrap>
    </NavBurgerStyled>
  );
};

export const NavMobile = ({ children }: { children: React.ReactNode }) => {
  const { asPath } = useRouter();

  return (
    <NavMobileStyled>
      <NavMobileWrapper>
        <NavMobileItem
          $isActive={
            asPath.startsWith('/vote') && !asPath.startsWith('/vote/delegation')
          }
        >
          <Link href="/vote" passHref>
            On-chain Voting
          </Link>
        </NavMobileItem>
        <NavMobileItem $isActive={asPath.startsWith('/vote/delegation')}>
          <Link href="/vote/delegation" passHref>
            Delegation
          </Link>
        </NavMobileItem>
        <NavMobileItem $isActive={asPath.startsWith('/governance')}>
          <Link href="/governance" passHref>
            Dual Governance
          </Link>
        </NavMobileItem>
        <NavMobileItem $isActive={asPath.startsWith('/easy-track')}>
          <Link href="/easy-track">Easy Track</Link>
        </NavMobileItem>
        <NavMobileActions>{children}</NavMobileActions>
      </NavMobileWrapper>
    </NavMobileStyled>
  );
};
