import { Link } from "react-router-dom";

export type VerificationStatus = "NOT_STARTED" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";

function statusLabel(s: VerificationStatus) {
  switch (s) {
    case "NOT_STARTED":
      return "Non commencé";
    case "PENDING_REVIEW":
      return "En attente de validation";
    case "APPROVED":
      return "Validé";
    case "REJECTED":
      return "Refusé";
  }
}

function statusClasses(s: VerificationStatus) {
  switch (s) {
    case "APPROVED":
      return "bg-green-50 border-green-200 text-green-800";
    case "PENDING_REVIEW":
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    case "REJECTED":
      return "bg-red-50 border-red-200 text-red-800";
    default:
      return "bg-gray-50 border-gray-200 text-gray-800";
  }
}

export default function VerificationCard({
  title,
  description,
  status,
  actionLabel,
  actionHref,
  onAction,
  fileName,
  rejectionReason,
}: {
  title: string;
  description: string;
  status: VerificationStatus;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  fileName?: string;
  rejectionReason?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="text-base font-semibold">{title}</div>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>

        <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(status)}`}>
          {statusLabel(status)}
        </div>
      </div>

      {fileName && (
        <div className="mt-3 text-sm text-gray-700">
          Fichier : <span className="font-medium">{fileName}</span>
        </div>
      )}

      {status === "REJECTED" && rejectionReason && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          Motif : <span className="font-semibold">{rejectionReason}</span>
        </div>
      )}

      {(actionHref || onAction) && (
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          {actionHref ? (
            <Link
              to={actionHref}
              className="rounded-xl bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-gray-800 text-center"
            >
              {actionLabel || "Continuer"}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="rounded-xl bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-gray-800"
            >
              {actionLabel || "Continuer"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
