import type { Metadata } from "next";
import AdminNavbar from "@/components/admin-panel/AdminNavbar";
import AdminSidebar from "@/components/admin-panel/AdminSidebar";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Top navbar */}
        <AdminNavbar />

        {/* Page area */}
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
