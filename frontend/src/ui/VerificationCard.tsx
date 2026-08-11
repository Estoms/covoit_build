import { Link } from "react-router-dom";
import StatusBadge, { type StatusTone } from "./StatusBadge";

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

function statusTone(s: VerificationStatus): StatusTone {
  switch (s) {
    case "APPROVED":
      return "success";
    case "PENDING_REVIEW":
      return "warning";
    case "REJECTED":
      return "danger";
    default:
      return "neutral";
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
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-gray-900">{title}</div>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>

        <StatusBadge label={statusLabel(status)} tone={statusTone(status)} />
      </div>

      {fileName && (
        <div className="mt-3 text-sm text-gray-700">
          Fichier : <span className="font-medium">{fileName}</span>
        </div>
      )}

      {status === "REJECTED" && rejectionReason && (
        <div className="mt-3 rounded-xl border border-brand-red-200 bg-brand-red-50 p-3 text-sm text-brand-red-700">
          Motif : <span className="font-semibold">{rejectionReason}</span>
        </div>
      )}

      {(actionHref || onAction) && (
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          {actionHref ? (
            <Link
              to={actionHref}
              className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700 text-center"
            >
              {actionLabel || "Continuer"}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700"
            >
              {actionLabel || "Continuer"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
