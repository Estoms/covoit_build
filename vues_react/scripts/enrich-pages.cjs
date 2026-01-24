const fs = require("fs");
const path = require("path");

const root = process.cwd();
const pagesRoot = path.join(root, "src", "pages");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function write(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf8");
}

function componentName(filePath) {
  const base = path.basename(filePath).replace(".tsx", "");
  return base;
}

function makeContent({ fileRel, title }) {
  // Catégories simples par dossier
  const folder = fileRel.split("/")[0];

  const subtitles = {
    public: "Contexte Bénin : villes (Porto-Novo, Cotonou, Parakou…), prix en FCFA, timezone Africa/Porto-Novo.",
    passenger: "Espace Passager : rechercher, réserver, payer, voyager et laisser un avis.",
    driver: "Espace Conducteur : publier, gérer les trajets, demandes, revenus et véhicules.",
    mixed: "Mode Mixte : basculer entre passager et conducteur, historique global et statistiques.",
    admin: "Administration : supervision, modération, finance, sécurité et configuration.",
    support: "Support : tickets utilisateurs, médiation, outils internes.",
  };

  const actionsByFolder = {
    public: [{ label: "Rechercher un trajet", href: "/search", variant: "primary" }],
    passenger: [
      { label: "Voir mes réservations", href: "/p/bookings/upcoming", variant: "primary" },
      { label: "Messages", href: "/p/messages", variant: "secondary" },
    ],
    driver: [
      { label: "Publier un trajet", href: "/d/trips/publish", variant: "primary" },
      { label: "Mes trajets", href: "/d/trips", variant: "secondary" },
    ],
    mixed: [{ label: "Historique global", href: "/m/history", variant: "primary" }],
    admin: [{ label: "Statistiques globales", href: "/admin/stats", variant: "primary" }],
    support: [{ label: "Tickets", href: "/support/tickets", variant: "primary" }],
  };

  const nextApiCommon = {
    public: ["GET /trips/search", "GET /trips/{id}", "GET /cities (Bénin)"],
    passenger: ["POST /bookings", "POST /payments", "GET /bookings/me", "POST /reviews"],
    driver: ["POST /trips", "PUT /trips/{id}", "GET /trips/me", "GET /earnings/me"],
    mixed: ["GET /history/me", "GET /stats/me"],
    admin: ["GET /admin/stats", "GET /admin/users", "POST /admin/moderation", "GET /admin/finance"],
    support: ["GET /support/tickets", "POST /support/tickets/{id}/reply", "POST /support/mediation"],
  };

  const comp = componentName(fileRel);
  return `import React from "react";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import InfoList from "../../ui/InfoList";

export default function ${comp}() {
  return (
    <PageShell
      title="${title.replace(/"/g, '\\"')}"
      subtitle="${(subtitles[folder] || "Page de la plateforme.").replace(/"/g, '\\"')}"
      actions={${JSON.stringify(actionsByFolder[folder] || [])}}
      nextApi={${JSON.stringify(nextApiCommon[folder] || [])}}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Objectif">
          <InfoList
            items={[
              "Décrire clairement le rôle de cette page",
              "Afficher une UI cohérente et responsive",
              "Préparer l’intégration backend (API)",
            ]}
          />
        </Section>

        <Section title="À implémenter (UI)">
          <InfoList
            items={[
              "Formulaire / liste / détails selon la page",
              "États : loading, empty, error",
              "Actions principales (CTA) + navigation",
            ]}
          />
        </Section>
      </div>

      <Section title="Notes Bénin">
        <InfoList
          items={[
            "Devise : FCFA (XOF)",
            "Fuseau horaire : Africa/Porto-Novo",
            "Villes : Porto-Novo, Cotonou, Abomey-Calavi, Parakou, …",
          ]}
        />
      </Section>
    </PageShell>
  );
}
`;
}

// Reprend la liste des pages (comme ton generateur)
const pages = [
  ["public/Home.tsx", "Accueil"],
  ["public/About.tsx", "À propos"],
  ["public/HowItWorks.tsx", "Comment ça marche"],
  ["public/TrustSafety.tsx", "Sécurité & confiance"],
  ["public/HelpFAQ.tsx", "Aide / FAQ"],
  ["public/LegalNotice.tsx", "Mentions légales"],
  ["public/PrivacyPolicy.tsx", "Politique de confidentialité"],
  ["public/Terms.tsx", "Conditions générales d’utilisation"],
  ["public/Login.tsx", "Connexion"],
  ["public/Register.tsx", "Inscription"],
  ["public/Search.tsx", "Recherche de trajets"],
  ["public/SearchResults.tsx", "Résultats de recherche"],
  ["public/TripDetailsPublic.tsx", "Détail d’un trajet (visiteur)"],

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
  ["passenger/Verifications.tsx", "Vérifications"],
  ["passenger/AccountSettings.tsx", "Paramètres du compte"],
  ["passenger/PaymentMethods.tsx", "Moyens de paiement"],
  ["passenger/PaymentsHistory.tsx", "Historique des paiements"],
  ["passenger/Support.tsx", "Support passager"],

  ["driver/DriverDashboard.tsx", "Tableau de bord conducteur"],
  ["driver/PublishTrip.tsx", "Publier un trajet"],
  ["driver/EditTrip.tsx", "Modifier un trajet"],
  ["driver/MyTrips.tsx", "Mes trajets"],
  ["driver/BookingRequests.tsx", "Demandes de réservation"],
  ["driver/PassengersList.tsx", "Liste des passagers"],
  ["driver/DriverMessages.tsx", "Messagerie conducteur"],
  ["driver/DriverNotifications.tsx", "Notifications conducteur"],
  ["driver/EarningsHistory.tsx", "Historique des gains"],
  ["driver/PayoutDetails.tsx", "Détails du paiement"],
  ["driver/PayoutSettings.tsx", "Paramètres de paiement"],
  ["driver/DriverProfile.tsx", "Profil conducteur"],
  ["driver/Vehicles.tsx", "Véhicules"],
  ["driver/DrivingPreferences.tsx", "Préférences de conduite"],
  ["driver/DriverReviews.tsx", "Avis reçus"],
  ["driver/DriverAccountSettings.tsx", "Paramètres du compte conducteur"],
  ["driver/AdvancedVerifications.tsx", "Vérifications avancées"],
  ["driver/DriverSupport.tsx", "Support conducteur"],

  ["mixed/UnifiedDashboard.tsx", "Dashboard unifié"],
  ["mixed/SwitchRole.tsx", "Changer de rôle"],
  ["mixed/GlobalHistory.tsx", "Historique global"],
  ["mixed/PersonalStats.tsx", "Statistiques personnelles"],

  ["admin/AdminDashboard.tsx", "Dashboard admin"],
  ["admin/GlobalStats.tsx", "Statistiques globales"],
  ["admin/UsersList.tsx", "Utilisateurs"],
  ["admin/UserDetails.tsx", "Détails utilisateur"],
  ["admin/UserModeration.tsx", "Modération utilisateur"],
  ["admin/ManualChecks.tsx", "Vérifications manuelles"],
  ["admin/ActiveTrips.tsx", "Trajets actifs"],
  ["admin/TripsHistory.tsx", "Historique des trajets"],
  ["admin/AnomalyDetection.tsx", "Détection anomalies"],
  ["admin/Transactions.tsx", "Transactions"],
  ["admin/DisputesRefunds.tsx", "Litiges & remboursements"],
  ["admin/FinanceReports.tsx", "Rapports financiers"],
  ["admin/Reports.tsx", "Rapports"],
  ["admin/FraudDetection.tsx", "Fraude"],
  ["admin/RulesConfig.tsx", "Règles métier"],
  ["admin/StaticContent.tsx", "Contenus statiques"],

  ["support/SupportConsole.tsx", "Console support"],
  ["support/Tickets.tsx", "Tickets"],
  ["support/TicketDetails.tsx", "Détail ticket"],
  ["support/MediationTools.tsx", "Médiation"],
  ["support/InternalFAQ.tsx", "FAQ interne"],
];

let count = 0;
for (const [rel, title] of pages) {
  const filePath = path.join(pagesRoot, rel);
  if (fs.existsSync(filePath)) {
    write(filePath, makeContent({ fileRel: rel, title }));
    count++;
  }
}
console.log("✅ Pages enrichies :", count);