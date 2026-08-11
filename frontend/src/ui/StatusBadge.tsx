/* eslint-disable react-refresh/only-export-components */

export type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-brand-green-50 border-brand-green-200 text-brand-green-700",
  warning: "bg-brand-yellow-50 border-brand-yellow-200 text-brand-yellow-700",
  danger: "bg-brand-red-50 border-brand-red-200 text-brand-red-700",
  neutral: "bg-gray-50 border-gray-200 text-gray-700",
  info: "bg-blue-50 border-blue-200 text-blue-700",
};

export default function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${TONE_CLASSES[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

// Mappings communs pour rester coherent dans toute l'app (vert = ok, jaune = en attente, rouge = probleme)
export function bookingStatusTone(status: string): StatusTone {
  switch (status) {
    case "CONFIRMED":
    case "COMPLETED":
      return "success";
    case "PENDING_PAYMENT":
    case "IN_PROGRESS":
      return "warning";
    case "CANCELLED":
      return "danger";
    default:
      return "neutral";
  }
}

export function verificationStatusTone(status: string): StatusTone {
  switch (status) {
    case "APPROVED":
      return "success";
    case "PENDING":
      return "warning";
    case "REJECTED":
      return "danger";
    default:
      return "neutral";
  }
}

export function ticketStatusTone(status: string): StatusTone {
  switch (status) {
    case "RESOLVED":
    case "CLOSED":
      return "success";
    case "IN_PROGRESS":
      return "warning";
    case "OPEN":
      return "info";
    default:
      return "neutral";
  }
}
