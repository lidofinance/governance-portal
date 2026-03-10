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
import {
  EASY_TRACK__MOTIONS_PATH,
  EASY_TRACK_PATH,
  GOVERNANCE_PATH,
  VOTE_DASHBOARD_INDEX_PATH,
  VOTE_DELEGATION_PATH,
  VOTE_PATH,
} from 'constants/urls';

export const Nav = () => {
  const { asPath } = useRouter();

  return (
    <NavStyled>
      <NavItem
        $isActive={
          asPath.startsWith(VOTE_PATH) &&
          !asPath.startsWith(VOTE_DELEGATION_PATH)
        }
      >
        <Link href={VOTE_DASHBOARD_INDEX_PATH} passHref>
          On-chain Voting
        </Link>
      </NavItem>
      <NavItem $isActive={asPath.startsWith(VOTE_DELEGATION_PATH)}>
        <Link href={VOTE_DELEGATION_PATH} passHref>
          Delegation
        </Link>
      </NavItem>
      <NavItem $isActive={asPath.startsWith(GOVERNANCE_PATH)}>
        <Link href={GOVERNANCE_PATH} passHref>
          Dual Governance
        </Link>
      </NavItem>
      <NavItem $isActive={asPath.startsWith(EASY_TRACK_PATH)}>
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
            asPath.startsWith(VOTE_PATH) &&
            !asPath.startsWith(VOTE_DELEGATION_PATH)
          }
        >
          <Link href={VOTE_DASHBOARD_INDEX_PATH} passHref>
            On-chain Voting
          </Link>
        </NavMobileItem>
        <NavMobileItem $isActive={asPath.startsWith(VOTE_DELEGATION_PATH)}>
          <Link href={VOTE_DELEGATION_PATH} passHref>
            Delegation
          </Link>
        </NavMobileItem>
        <NavMobileItem $isActive={asPath.startsWith(GOVERNANCE_PATH)}>
          <Link href={GOVERNANCE_PATH} passHref>
            Dual Governance
          </Link>
        </NavMobileItem>
        <NavMobileItem $isActive={asPath.startsWith(EASY_TRACK_PATH)}>
          <Link href={EASY_TRACK__MOTIONS_PATH}>Easy Track</Link>
        </NavMobileItem>
        <NavMobileActions>{children}</NavMobileActions>
      </NavMobileWrapper>
    </NavMobileStyled>
  );
};
