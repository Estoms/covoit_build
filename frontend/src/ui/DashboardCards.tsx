import { Link } from "react-router-dom";

export function StatCard({
  title,
  value,
  hint,
  href,
  tone = "neutral",
}: {
  title: string;
  value: string;
  hint?: string;
  href?: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const toneBar: Record<string, string> = {
    neutral: "bg-gray-200",
    success: "bg-brand-green-500",
    warning: "bg-brand-yellow-500",
    danger: "bg-brand-red-500",
  };

  const inner = (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md transition">
      <span className={`absolute left-0 top-0 h-full w-1 ${toneBar[tone]}`} />
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-1 text-2xl font-extrabold text-gray-900">{value}</div>
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
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="mt-3 grid gap-2">
        {items.length === 0 ? (
          <div className="text-sm text-gray-600">{empty || "Aucun élément."}</div>
        ) : (
          items.slice(0, 5).map((it) =>
            it.href ? (
              <Link
                key={it.label}
                to={it.href}
                className="rounded-xl border border-gray-200 px-3 py-2 hover:bg-brand-green-50 hover:border-brand-green-200 transition"
              >
                <div className="text-sm font-medium text-gray-900">{it.label}</div>
                {it.meta && <div className="text-xs text-gray-600">{it.meta}</div>}
              </Link>
            ) : (
              <div key={it.label} className="rounded-xl border border-gray-200 px-3 py-2">
                <div className="text-sm font-medium text-gray-900">{it.label}</div>
                {it.meta && <div className="text-xs text-gray-600">{it.meta}</div>}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
