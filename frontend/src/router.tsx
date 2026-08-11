/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

// Public
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import HowItWorks from "./pages/public/HowItWorks";
import HelpFAQ from "./pages/public/HelpFAQ";
import TrustSafety from "./pages/public/TrustSafety";
import LegalNotice from "./pages/public/LegalNotice";
import Search from "./pages/public/Search";
import SearchResults from "./pages/public/SearchResults";
import TripDetailsPublic from "./pages/public/TripDetailsPublic";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Terms from "./pages/public/Terms";
import Privacy from "./pages/public/PrivacyPolicy";
import VerifyEmail from "./pages/public/VerifyEmail";
import Forbidden from "./pages/public/Forbidden";

// Shared (any authenticated role)
import NotificationsInbox from "./pages/shared/NotificationsInbox";
import MessagesInbox from "./pages/shared/MessagesInbox";
import Verifications from "./pages/profile/Verifications";
import FaceScan from "./pages/profile/FaceScan";
import PublicProfile from "./pages/passenger/PublicProfile";

// Passenger
import PassengerDashboard from "./pages/passenger/PassengerDashboard";
import TripDetails from "./pages/passenger/TripDetails";
import Booking from "./pages/passenger/Booking";
import Payment from "./pages/passenger/Payment";
import BookingConfirmation from "./pages/passenger/BookingConfirmation";
import MyBookingsUpcoming from "./pages/passenger/MyBookingsUpcoming";
import MyBookingsPast from "./pages/passenger/MyBookingsPast";
import MyBookingsCancelled from "./pages/passenger/MyBookingsCancelled";
import BookingDetails from "./pages/passenger/BookingDetails";
import LeaveReview from "./pages/passenger/LeaveReview";
import PaymentsHistory from "./pages/passenger/PaymentsHistory";
import PaymentMethods from "./pages/passenger/PaymentMethods";
import AccountSettings from "./pages/passenger/AccountSettings";
import PassengerSupport from "./pages/passenger/Support";
import Loyalty from "./pages/passenger/Loyalty";

// Driver
import DriverDashboard from "./pages/driver/DriverDashboard";
import MyTrips from "./pages/driver/MyTrips";
import PublishTrip from "./pages/driver/PublishTrip";
import EditTrip from "./pages/driver/EditTrip";
import Requests from "./pages/driver/Requests";
import PassengersList from "./pages/driver/PassengersList";
import Earnings from "./pages/driver/Earnings";
import EarningsHistory from "./pages/driver/EarningsHistory";
import PayoutSettings from "./pages/driver/PayoutSettings";
import PayoutDetails from "./pages/driver/PayoutDetails";
import Vehicles from "./pages/driver/Vehicles";
import DriverProfile from "./pages/driver/DriverProfile";
import DrivingPreferences from "./pages/driver/DrivingPreferences";
import DriverReviews from "./pages/driver/DriverReviews";
import Rewards from "./pages/driver/Rewards";
import AdvancedVerifications from "./pages/driver/AdvancedVerifications";
import DriverSupport from "./pages/driver/DriverSupport";
import DriverAccountSettings from "./pages/driver/DriverAccountSettings";

// Mixed
import UnifiedDashboard from "./pages/mixed/UnifiedDashboard";
import MixedHistory from "./pages/mixed/History";
import GlobalHistory from "./pages/mixed/GlobalHistory";
import PersonalStats from "./pages/mixed/PersonalStats";
import SwitchRole from "./pages/mixed/SwitchRole";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersList from "./pages/admin/UsersList";
import UserDetails from "./pages/admin/UserDetails";
import UserModeration from "./pages/admin/UserModeration";
import ManualChecks from "./pages/admin/ManualChecks";
import AdminTrips from "./pages/admin/Trips";
import ActiveTrips from "./pages/admin/ActiveTrips";
import TripsHistory from "./pages/admin/TripsHistory";
import AdminTransactions from "./pages/admin/Transactions";
import FinanceReports from "./pages/admin/FinanceReports";
import DisputesRefunds from "./pages/admin/DisputesRefunds";
import FraudDetection from "./pages/admin/FraudDetection";
import AnomalyDetection from "./pages/admin/AnomalyDetection";
import RulesConfig from "./pages/admin/RulesConfig";
import StaticContent from "./pages/admin/StaticContent";
import AdminReports from "./pages/admin/Reports";
import GlobalStats from "./pages/admin/GlobalStats";

// Support
import SupportConsole from "./pages/support/SupportConsole";
import SupportTickets from "./pages/support/Tickets";
import TicketDetails from "./pages/support/TicketDetails";
import SupportMediation from "./pages/support/Mediation";
import MediationTools from "./pages/support/MediationTools";
import SupportInternalFaq from "./pages/support/InternalFAQ";

function NotFound() {
  return <h1 className="p-6 text-xl">404 - Page introuvable</h1>;
}

const ANY_AUTH = ["PASSENGER", "DRIVER", "PASSENGER_DRIVER", "ADMIN", "SUPPORT"] as const;
const PASSENGER_ROLES = ["PASSENGER", "PASSENGER_DRIVER"] as const;
const DRIVER_ROLES = ["DRIVER", "PASSENGER_DRIVER"] as const;
const MIXED_ROLES = ["PASSENGER_DRIVER"] as const;

export const router = createBrowserRouter(
  [
    // ---------------- PUBLIC ----------------
    {
      element: <PublicLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/about", element: <About /> },
        { path: "/how-it-works", element: <HowItWorks /> },
        { path: "/help", element: <HelpFAQ /> },
        { path: "/trust-safety", element: <TrustSafety /> },
        { path: "/legal", element: <LegalNotice /> },
        { path: "/search", element: <Search /> },
        { path: "/search/results", element: <SearchResults /> },
        { path: "/trips/:tripId", element: <TripDetailsPublic /> },

        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/verify-email", element: <VerifyEmail /> },

        { path: "/terms", element: <Terms /> },
        { path: "/privacy", element: <Privacy /> },

        { path: "/403", element: <Forbidden /> },
      ],
    },

    // ---------------- APP (CONNECTED) ----------------
    {
      element: <AppLayout />,
      children: [
        // SHARED
        { path: "/notifications", element: <ProtectedRoute roles={[...ANY_AUTH]}><NotificationsInbox /></ProtectedRoute> },
        { path: "/messages", element: <ProtectedRoute roles={[...ANY_AUTH]}><MessagesInbox /></ProtectedRoute> },
        { path: "/profile/verifications", element: <ProtectedRoute roles={[...ANY_AUTH]}><Verifications /></ProtectedRoute> },
        { path: "/verify/face", element: <ProtectedRoute roles={[...ANY_AUTH]}><FaceScan /></ProtectedRoute> },
        { path: "/profile/:userId", element: <ProtectedRoute roles={[...ANY_AUTH]}><PublicProfile /></ProtectedRoute> },

        // PASSENGER
        { path: "/p", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><PassengerDashboard /></ProtectedRoute> },
        { path: "/p/bookings/upcoming", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><MyBookingsUpcoming /></ProtectedRoute> },
        { path: "/p/bookings/past", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><MyBookingsPast /></ProtectedRoute> },
        { path: "/p/bookings/cancelled", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><MyBookingsCancelled /></ProtectedRoute> },
        { path: "/p/bookings/:bookingId", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><BookingDetails /></ProtectedRoute> },
        { path: "/p/trips/:tripId", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><TripDetails /></ProtectedRoute> },
        { path: "/p/booking/:tripId", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><Booking /></ProtectedRoute> },
        { path: "/p/payment/:bookingId", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><Payment /></ProtectedRoute> },
        { path: "/p/booking/confirmation/:bookingId", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><BookingConfirmation /></ProtectedRoute> },
        { path: "/p/reviews/new/:bookingId", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><LeaveReview /></ProtectedRoute> },
        { path: "/p/payments/history", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><PaymentsHistory /></ProtectedRoute> },
        { path: "/p/payment-methods", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><PaymentMethods /></ProtectedRoute> },
        { path: "/p/loyalty", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><Loyalty /></ProtectedRoute> },
        { path: "/p/account", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><AccountSettings /></ProtectedRoute> },
        { path: "/p/support", element: <ProtectedRoute roles={[...PASSENGER_ROLES]}><PassengerSupport /></ProtectedRoute> },

        // DRIVER
        { path: "/d", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><DriverDashboard /></ProtectedRoute> },
        { path: "/d/trips", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><MyTrips /></ProtectedRoute> },
        { path: "/d/trips/publish", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><PublishTrip /></ProtectedRoute> },
        { path: "/d/trips/:tripId/edit", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><EditTrip /></ProtectedRoute> },
        { path: "/d/trips/:tripId/passengers", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><PassengersList /></ProtectedRoute> },
        { path: "/d/requests", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><Requests /></ProtectedRoute> },
        { path: "/d/earnings", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><Earnings /></ProtectedRoute> },
        { path: "/d/earnings/history", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><EarningsHistory /></ProtectedRoute> },
        { path: "/d/payout-settings", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><PayoutSettings /></ProtectedRoute> },
        { path: "/d/payout-details/:transactionId", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><PayoutDetails /></ProtectedRoute> },
        { path: "/d/vehicles", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><Vehicles /></ProtectedRoute> },
        { path: "/d/profile", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><DriverProfile /></ProtectedRoute> },
        { path: "/d/preferences", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><DrivingPreferences /></ProtectedRoute> },
        { path: "/d/reviews", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><DriverReviews /></ProtectedRoute> },
        { path: "/d/rewards", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><Rewards /></ProtectedRoute> },
        { path: "/d/advanced-verifications", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><AdvancedVerifications /></ProtectedRoute> },
        { path: "/d/support", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><DriverSupport /></ProtectedRoute> },
        { path: "/d/account", element: <ProtectedRoute roles={[...DRIVER_ROLES]}><DriverAccountSettings /></ProtectedRoute> },

        // MIXED
        { path: "/m", element: <ProtectedRoute roles={[...MIXED_ROLES]}><UnifiedDashboard /></ProtectedRoute> },
        { path: "/m/history", element: <ProtectedRoute roles={[...MIXED_ROLES]}><MixedHistory /></ProtectedRoute> },
        { path: "/m/history/all", element: <ProtectedRoute roles={[...MIXED_ROLES]}><GlobalHistory /></ProtectedRoute> },
        { path: "/m/stats", element: <ProtectedRoute roles={[...MIXED_ROLES]}><PersonalStats /></ProtectedRoute> },
        { path: "/m/switch-role", element: <ProtectedRoute roles={[...MIXED_ROLES]}><SwitchRole /></ProtectedRoute> },

        // ADMIN
        { path: "/admin", element: <ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute> },
        { path: "/admin/users", element: <ProtectedRoute roles={["ADMIN"]}><UsersList /></ProtectedRoute> },
        { path: "/admin/users/:userId", element: <ProtectedRoute roles={["ADMIN"]}><UserDetails /></ProtectedRoute> },
        { path: "/admin/user-moderation", element: <ProtectedRoute roles={["ADMIN"]}><UserModeration /></ProtectedRoute> },
        { path: "/admin/manual-checks", element: <ProtectedRoute roles={["ADMIN"]}><ManualChecks /></ProtectedRoute> },
        { path: "/admin/trips", element: <ProtectedRoute roles={["ADMIN"]}><AdminTrips /></ProtectedRoute> },
        { path: "/admin/trips/active", element: <ProtectedRoute roles={["ADMIN"]}><ActiveTrips /></ProtectedRoute> },
        { path: "/admin/trips/history", element: <ProtectedRoute roles={["ADMIN"]}><TripsHistory /></ProtectedRoute> },
        { path: "/admin/transactions", element: <ProtectedRoute roles={["ADMIN"]}><AdminTransactions /></ProtectedRoute> },
        { path: "/admin/finance-reports", element: <ProtectedRoute roles={["ADMIN"]}><FinanceReports /></ProtectedRoute> },
        { path: "/admin/disputes", element: <ProtectedRoute roles={["ADMIN"]}><DisputesRefunds /></ProtectedRoute> },
        { path: "/admin/fraud-detection", element: <ProtectedRoute roles={["ADMIN"]}><FraudDetection /></ProtectedRoute> },
        { path: "/admin/anomaly-detection", element: <ProtectedRoute roles={["ADMIN"]}><AnomalyDetection /></ProtectedRoute> },
        { path: "/admin/rules-config", element: <ProtectedRoute roles={["ADMIN"]}><RulesConfig /></ProtectedRoute> },
        { path: "/admin/static-content", element: <ProtectedRoute roles={["ADMIN"]}><StaticContent /></ProtectedRoute> },
        { path: "/admin/reports", element: <ProtectedRoute roles={["ADMIN"]}><AdminReports /></ProtectedRoute> },
        { path: "/admin/stats", element: <ProtectedRoute roles={["ADMIN"]}><GlobalStats /></ProtectedRoute> },

        // SUPPORT
        { path: "/support", element: <ProtectedRoute roles={["SUPPORT", "ADMIN"]}><SupportConsole /></ProtectedRoute> },
        { path: "/support/tickets", element: <ProtectedRoute roles={["SUPPORT", "ADMIN"]}><SupportTickets /></ProtectedRoute> },
        { path: "/support/tickets/:id", element: <ProtectedRoute roles={[...ANY_AUTH]}><TicketDetails /></ProtectedRoute> },
        { path: "/support/mediation", element: <ProtectedRoute roles={["SUPPORT", "ADMIN"]}><SupportMediation /></ProtectedRoute> },
        { path: "/support/mediation/:id/tools", element: <ProtectedRoute roles={["SUPPORT", "ADMIN"]}><MediationTools /></ProtectedRoute> },
        { path: "/support/internal-faq", element: <ProtectedRoute roles={["SUPPORT", "ADMIN"]}><SupportInternalFaq /></ProtectedRoute> },
      ],
    },

    // NOT FOUND
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);
