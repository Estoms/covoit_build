import React from "react";
import { useNavigate } from "react-router-dom";

type Action = { label: string; href?: string; onClick?: () => void; variant?: "primary" | "secondary" | "danger" };

function actionClasses(variant: Action["variant"]) {
  switch (variant) {
    case "secondary":
      return "rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-800 hover:bg-gray-50 text-center";
    case "danger":
      return "rounded-xl bg-brand-red-500 px-4 py-2 text-white font-medium hover:bg-brand-red-600 text-center";
    default:
      return "rounded-xl bg-brand-green-600 px-4 py-2 text-white font-medium hover:bg-brand-green-700 text-center";
  }
}

export default function PageShell({
  title,
  subtitle,
  actions,
  children,
  nextApi,
  backTo,
  showBack = true,
}: {
  title: string;
  subtitle?: string;
  actions?: Action[];
  children?: React.ReactNode;
  nextApi?: string[];
  backTo?: string;
  showBack?: boolean;
}) {
  const nav = useNavigate();

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
        {showBack && (
          <div className="mb-3">
            <button
              type="button"
              onClick={() => (backTo ? nav(backTo) : nav(-1))}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span aria-hidden>←</span> Retour
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">{title}</h1>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>

          {actions && actions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              {actions.map((a) =>
                a.href ? (
                  <a key={a.label} href={a.href} className={actionClasses(a.variant)}>
                    {a.label}
                  </a>
                ) : (
                  <button key={a.label} onClick={a.onClick} className={actionClasses(a.variant)}>
                    {a.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </header>

      {children}

      {nextApi && nextApi.length > 0 && (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 md:p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Endpoints API utilisés</h2>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-600">
            {nextApi.map((x) => (
              <li key={x}>
                <code className="text-xs bg-white border rounded px-1.5 py-0.5">{x}</code>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
