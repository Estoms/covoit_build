/* scripts/generate-pages.cjs */
const fs = require("fs");
const path = require("path");

const root = path.join(process.cwd(), "src");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function pageStub(title) {
  return `import React from "react";
import Page from "../../ui/Page";

export default function ${titleToComponent(title)}() {
  return <Page title="${escapeQuotes(title)}" />;
}
`;
}

function escapeQuotes(s) {
  return s.replace(/"/g, '\\"');
}

function titleToComponent(title) {
  // Convertit un titre en nom de composant valide (simple)
  const cleaned = title
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  return cleaned || "Page";
}

// Pages listées (chemin relatif depuis src/pages)
const pages = [
  // public
  ["public/Home.tsx", "Accueil"],
  ["public/About.tsx", "À propos"],
  ["public/HowItWorks.tsx", "Comment ça marche"],
  ["public/TrustSafety.tsx", "Sécurité & confiance"],
  ["public/HelpFAQ.tsx", "Aide / FAQ"],
  ["public/LegalNotice.tsx", "Mentions légales"],
  ["public/PrivacyPolicy.tsx", "Politique de confidentialité"],
  ["public/Terms.tsx", "Conditions générales d’utilisation"],
  ["public/Login.tsx", "Connexion"],           // (sera remplacée ensuite si tu veux)
  ["public/Register.tsx", "Inscription"],
  ["public/Search.tsx", "Recherche de trajets"],
  ["public/SearchResults.tsx", "Résultats de recherche"],
  ["public/TripDetailsPublic.tsx", "Détail d’un trajet (visiteur)"],

  // passenger
  ["passenger/PassengerDashboard.tsx", "Tableau de bord passager"],
  ["passenger/TripDetails.tsx", "Détail d’un trajet (passager)"],
  ["passenger/Booking.tsx", "Réservation"],
  ["passenger/Payment.tsx", "Paiement"],
  ["passenger/BookingConfirmation.tsx", "Confirmation de réservation"],
  ["passenger/MyBookingsUpcoming.tsx", "Mes réservations à venir"],
  ["passenger/MyBookingsPast.tsx", "Mes réservations passées"],
  ["passenger/MyBookingsCancelled.tsx", "Mes réservations annulées"],
  ["passenger/BookingDetails.tsx", "Détail d’une réservation"],
  ["passenger/Messages.tsx", "Messagerie (passager)"],
  ["passenger/Notifications.tsx", "Notifications (passager)"],
  ["passenger/PublicProfile.tsx", "Profil utilisateur public"],
  ["passenger/LeaveReview.tsx", "Laisser un avis"],
  ["passenger/Verifications.tsx", "Vérifications (email/téléphone/identité)"],
  ["passenger/AccountSettings.tsx", "Paramètres du compte (passager)"],
  ["passenger/PaymentMethods.tsx", "Moyens de paiement"],
  ["passenger/PaymentsHistory.tsx", "Historique des paiements"],
  ["passenger/Support.tsx", "Aide / support (passager)"],

  // driver
  ["driver/DriverDashboard.tsx", "Tableau de bord conducteur"],
  ["driver/PublishTrip.tsx", "Publier un trajet"],
  ["driver/EditTrip.tsx", "Modifier / annuler un trajet"],
  ["driver/MyTrips.tsx", "Mes trajets proposés"],
  ["driver/BookingRequests.tsx", "Demandes de réservation"],
  ["driver/PassengersList.tsx", "Liste des passagers"],
  ["driver/DriverMessages.tsx", "Messagerie (conducteur)"],
  ["driver/DriverNotifications.tsx", "Notifications (conducteur)"],
  ["driver/EarningsHistory.tsx", "Historique des gains"],
  ["driver/PayoutDetails.tsx", "Détails d’un paiement"],
  ["driver/PayoutSettings.tsx", "Paramètres de paiement"],
  ["driver/DriverProfile.tsx", "Profil conducteur"],
  ["driver/Vehicles.tsx", "Gestion des véhicules"],
  ["driver/DrivingPreferences.tsx", "Préférences de conduite"],
  ["driver/DriverReviews.tsx", "Évaluations reçues (conducteur)"],
  ["driver/DriverAccountSettings.tsx", "Paramètres du compte (conducteur)"],
  ["driver/AdvancedVerifications.tsx", "Vérifications avancées"],
  ["driver/DriverSupport.tsx", "Support conducteur"],

  // mixed
  ["mixed/UnifiedDashboard.tsx", "Tableau de bord unifié"],
  ["mixed/SwitchRole.tsx", "Bascule passager / conducteur"],
  ["mixed/GlobalHistory.tsx", "Historique global"],
  ["mixed/PersonalStats.tsx", "Statistiques personnelles"],

  // admin
  ["admin/AdminDashboard.tsx", "Dashboard administrateur"],
  ["admin/GlobalStats.tsx", "Statistiques globales"],
  ["admin/UsersList.tsx", "Liste des utilisateurs"],
  ["admin/UserDetails.tsx", "Consultation profil utilisateur"],
  ["admin/UserModeration.tsx", "Suspension / bannissement"],
  ["admin/ManualChecks.tsx", "Vérifications manuelles"],
  ["admin/ActiveTrips.tsx", "Supervision des trajets actifs"],
  ["admin/TripsHistory.tsx", "Historique des trajets"],
  ["admin/AnomalyDetection.tsx", "Détection d’anomalies"],
  ["admin/Transactions.tsx", "Suivi des transactions"],
  ["admin/DisputesRefunds.tsx", "Litiges et remboursements"],
  ["admin/FinanceReports.tsx", "Rapports financiers"],
  ["admin/Reports.tsx", "Rapports"],
  ["admin/FraudDetection.tsx", "Détection de fraude"],
  ["admin/RulesConfig.tsx", "Gestion des règles métier"],
  ["admin/StaticContent.tsx", "Gestion des contenus statiques"],

  // support
  ["support/SupportConsole.tsx", "Interface support"],
  ["support/Tickets.tsx", "Tickets utilisateurs"],
  ["support/TicketDetails.tsx", "Détail d’un ticket"],
  ["support/MediationTools.tsx", "Outils de médiation"],
  ["support/InternalFAQ.tsx", "FAQ interne"],
];

pages.forEach(([rel, title]) => {
  const filePath = path.join(root, "pages", rel);
  writeFile(filePath, pageStub(title));
});

console.log("✅ Pages générées :", pages.length);
