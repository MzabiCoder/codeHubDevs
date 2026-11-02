import { TopBar } from "@/components/dashboard/TopBar";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="w-32 shrink-0 border-r p-4 md:w-72">
        <h1 className="text-lg font-semibold text-white">Sidebar</h1>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
