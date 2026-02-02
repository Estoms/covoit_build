import { Link } from "react-router-dom";

export function StatCard({
  title,
  value,
  hint,
  href,
}: {
  title: string;
  value: string;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border bg-white p-4 hover:shadow-sm transition">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );

  return href ? <Link to={href}>{inner}</Link> : inner;
}

export function MiniList({
  title,
  items,
  empty,
}: {
  title: string;
  items: { label: string; meta?: string; href?: string }[];
  empty?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="font-semibold">{title}</div>
      <div className="mt-3 grid gap-2">
        {items.length === 0 ? (
          <div className="text-sm text-gray-600">{empty || "Aucun élément."}</div>
        ) : (
          items.slice(0, 5).map((it) =>
            it.href ? (
              <Link
                key={it.label}
                to={it.href}
                className="rounded-xl border px-3 py-2 hover:bg-gray-50"
              >
                <div className="text-sm font-medium">{it.label}</div>
                {it.meta && <div className="text-xs text-gray-600">{it.meta}</div>}
              </Link>
            ) : (
              <div key={it.label} className="rounded-xl border px-3 py-2">
                <div className="text-sm font-medium">{it.label}</div>
                {it.meta && <div className="text-xs text-gray-600">{it.meta}</div>}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
