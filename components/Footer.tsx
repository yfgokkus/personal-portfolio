import { prisma } from "@/lib/prismaClient";

export default async function Footer() {
  const result = await prisma.user_info.findFirst({
    select: { full_name: true },
  });

  const fullName = result?.full_name ?? "";

  return (
    <footer className="w-full py-5 text-center text-sm border-t border-slate-200 dark:border-slate-900">
      {new Date().getFullYear()} {fullName}.
    </footer>
  );
}
