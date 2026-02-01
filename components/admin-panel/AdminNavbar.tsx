"use client";
import Link from "next/link";
import { Sun, Moon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <nav className="h-16 w-full border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="flex h-full items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-wide">
          YF.
        </Link>

        <div className="flex items-center gap-10">
          <button className="cursor-pointer">
            <Moon />
          </button>
          <button onClick={handleLogout} className="cursor-pointer">
            <LogOut />
          </button>
        </div>
      </div>
    </nav>
  );
}
