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
import { EASY_TRACK__MOTIONS_PATH } from 'constants/urls';

export const Nav = () => {
  const { asPath } = useRouter();

  return (
    <NavStyled>
      <NavItem
        $isActive={
          asPath.startsWith('/vote') && !asPath.startsWith('/vote/delegation')
        }
      >
        <Link href="/vote/dashboard" passHref>
          On-chain Voting
        </Link>
      </NavItem>
      <NavItem $isActive={asPath.startsWith('/vote/delegation')}>
        <Link href="/vote/delegation" passHref>
          Delegation
        </Link>
      </NavItem>
      <NavItem $isActive={asPath.startsWith('/dg')}>
        <Link href="/dg" passHref>
          Dual Governance
        </Link>
      </NavItem>
      <NavItem $isActive={asPath.startsWith('/easy-track')}>
        <Link href={EASY_TRACK__MOTIONS_PATH}>Easy Track</Link>
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
    <NavBurgerStyled
      onClick={onClick}
      $isOpened={isOpened}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
    >
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
          <Link href="/vote/dashboard" passHref>
            On-chain Voting
          </Link>
        </NavMobileItem>
        <NavMobileItem $isActive={asPath.startsWith('/vote/delegation')}>
          <Link href="/vote/delegation" passHref>
            Delegation
          </Link>
        </NavMobileItem>
        <NavMobileItem $isActive={asPath.startsWith('/dg')}>
          <Link href="/dg" passHref>
            Dual Governance
          </Link>
        </NavMobileItem>
        <NavMobileItem $isActive={asPath.startsWith('/easy-track')}>
          <Link href={EASY_TRACK__MOTIONS_PATH}>Easy Track</Link>
        </NavMobileItem>
        <NavMobileActions>{children}</NavMobileActions>
      </NavMobileWrapper>
    </NavMobileStyled>
  );
};
