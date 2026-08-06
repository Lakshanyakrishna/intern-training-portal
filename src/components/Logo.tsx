import { LumoraStar } from './Icons';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  withText?: boolean;
  withIcon?: boolean;
  iconSize?: number;
}

export default function Logo({
  className = "flex items-center gap-2",
  iconClassName = "w-5 h-5",
  textClassName = "",
  withText = true,
  withIcon = true,
  iconSize,
  ...props
}: LogoProps) {
  return (
    <div className={className} {...props}>
      {withIcon && <LumoraStar className={iconClassName} size={iconSize} />}
      {withText && <span className={textClassName}>Lumora</span>}
    </div>
  );
}
