import Image from 'next/image';
import { AvatarWrap } from './style';
import { AvatarPlaceholder } from 'shared/components/icons';

type Props = {
  avatarSrc: string | null | undefined;
  size?: number;
};

export const PublicDelegateAvatar = ({ avatarSrc, size }: Props) => {
  if (!avatarSrc) {
    return (
      <AvatarWrap size={size}>
        <AvatarPlaceholder />
      </AvatarWrap>
    );
  }

  return (
    <AvatarWrap size={size}>
      <Image
        src={avatarSrc}
        alt=""
        layout="fill"
        loader={({ src }) => src}
        unoptimized
      />
    </AvatarWrap>
  );
};
