import React from "react";
import { useNavigate } from "react-router-dom";

type Action = { label: string; href?: string; onClick?: () => void; variant?: "primary" | "secondary" };

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
  /** If provided, clicking "Retour" navigates to this path. Otherwise goes back one step. */
  backTo?: string;
  /** Show a back button in the header. Defaults to true. */
  showBack?: boolean;
}) {
  const nav = useNavigate();

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border bg-white p-4 md:p-6">
        {showBack && (
          <div className="mb-3">
            <button
              type="button"
              onClick={() => (backTo ? nav(backTo) : nav(-1))}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <span aria-hidden>←</span> Retour
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>

          {actions && actions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              {actions.map((a) =>
                a.href ? (
                  <a
                    key={a.label}
                    href={a.href}
                    className={
                      a.variant === "secondary"
                        ? "rounded-xl border px-4 py-2 font-medium hover:bg-gray-50 text-center"
                        : "rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800 text-center"
                    }
                  >
                    {a.label}
                  </a>
                ) : (
                  <button
                    key={a.label}
                    onClick={a.onClick}
                    className={
                      a.variant === "secondary"
                        ? "rounded-xl border px-4 py-2 font-medium hover:bg-gray-50"
                        : "rounded-xl bg-gray-900 px-4 py-2 text-white font-medium hover:bg-gray-800"
                    }
                  >
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
        <section className="rounded-2xl border bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold">Prochaine intégration API</h2>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-700">
            {nextApi.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
