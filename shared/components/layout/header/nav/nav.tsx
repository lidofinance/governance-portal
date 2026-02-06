import { NavItem, NavStyled } from './style';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const NavStyledNav = () => {
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
