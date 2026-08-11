export const APP_LOCALE = "fr-BJ";
export const APP_TIMEZONE = "Africa/Porto-Novo";
export const APP_CURRENCY = "XOF"; // Franc CFA (BCEAO)

// Helpers (formatage)
export const formatMoney = (amount: number) =>
  new Intl.NumberFormat(APP_LOCALE, {
    style: "currency",
    currency: APP_CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: APP_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: APP_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
