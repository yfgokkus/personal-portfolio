import Link from "next/link";
import { cn } from "@/lib/cn";

export default function NavButton({
  href,
  label,
  Icon,
  className,
}: {
  href: string;
  label: string;
  Icon: any;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-lg p-2 text-slate-900 dark:text-slate-200"
    >
      <Icon className="w-5 h-5" />

      <span
        className={cn(
          "overflow-hidden max-w-0 group-hover:max-w-25 opacity-0 group-hover:opacity-100 whitespace-nowrap text-sm",
          className,
        )}
        style={{ transition: "max-width 300ms ease, opacity 300ms ease" }}
      >
        {label}
      </span>
    </Link>
  );
}
