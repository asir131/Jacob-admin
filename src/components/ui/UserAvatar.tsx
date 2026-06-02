/* eslint-disable @next/next/no-img-element */
import { MdPersonOutline } from 'react-icons/md';

type Props = {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
};

export default function UserAvatar({ src, alt = 'User', size = 40, className = '' }: Props) {
  const style = { width: size, height: size };

  if (src) {
    return <img src={src} alt={alt} className={`rounded-full object-cover ${className}`} style={style} />;
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 ${className}`}
      style={style}
      aria-label={alt}
    >
      <MdPersonOutline className="h-1/2 w-1/2" aria-hidden="true" />
    </div>
  );
}
