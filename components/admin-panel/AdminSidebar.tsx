import Link from "next/link";
import { Home, Mail, FileText, FolderCode, BookOpenText } from "lucide-react";

const navItems = [
  { label: "Home", href: "/admin/home", Icon: Home },
  { label: "Projects", href: "/admin/projects", Icon: FolderCode },
  { label: "Experiences", href: "/admin/experiences", Icon: BookOpenText },
  { label: "Resume", href: "/admin/resume", Icon: FileText },
  { label: "Messages", href: "/admin/messages", Icon: Mail },
];

export default function AdminSidebar() {
  return (
    <aside
      className="
        w-60 shrink-0
        border-r border-neutral-200
        bg-white
        px-4 py-6
      "
    >
      <h2 className="mb-8 text-xl font-bold">Admin Panel</h2>

      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="
              flex items-center gap-3 rounded-md px-3 py-2
              text-sm font-medium text-neutral-700
              transition hover:bg-neutral-100
            "
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
