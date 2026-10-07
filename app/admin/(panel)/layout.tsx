import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/auth/session";
import { hasDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <AdminShell user={user}>
      {hasDatabase() ? (
        children
      ) : (
        <div className="rounded-2xl border border-pomodoro/20 bg-white p-8">
          <h1 className="font-display text-[2rem]">Connect the database</h1>
          <p className="mt-3 text-frantoio/70">
            Add your Neon connection string as DATABASE_URL, then run <code>npm run db:migrate</code> and{" "}
            <code>npm run db:seed</code>.
          </p>
        </div>
      )}
    </AdminShell>
  );
}
