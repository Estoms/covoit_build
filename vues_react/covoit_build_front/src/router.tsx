import ProtectedRoute from "./auth/ProtectedRoute";
import Forbidden from "./pages/public/Forbidden";

import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

// Public
import Home from "./pages/public/Home";
import Search from "./pages/public/Search";
import SearchResults from "./pages/public/SearchResults";
import TripDetailsPublic from "./pages/public/TripDetailsPublic";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Terms from "./pages/public/Terms";
import Privacy from "./pages/public/PrivacyPolicy";
import VerifyEmail from "./pages/public/VerifyEmail";

// Passenger
import PassengerDashboard from "./pages/passenger/PassengerDashboard";
import TripDetails from "./pages/passenger/TripDetails";
import Booking from "./pages/passenger/Booking";
import Payment from "./pages/passenger/Payment";
import BookingConfirmation from "./pages/passenger/BookingConfirmation";
import PassengerMessages from "./pages/passenger/Messages";
import UpcomingBookings from "./pages/passenger/UpcomingBookings";
import PaymentsHistory from "./pages/passenger/PaymentsHistory";

// Driver
import DriverDashboard from "./pages/driver/DriverDashboard";
import MyTrips from "./pages/driver/MyTrips";
import PublishTrip from "./pages/driver/PublishTrip";
import Requests from "./pages/driver/Requests";
import Earnings from "./pages/driver/Earnings";

// Mixed
import UnifiedDashboard from "./pages/mixed/UnifiedDashboard";
import MixedHistory from "./pages/mixed/History";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminTrips from "./pages/admin/Trips";
import AdminReports from "./pages/admin/Reports";
import AdminStats from "./pages/admin/Stats";

// Support
import SupportConsole from "./pages/support/SupportConsole";
import SupportTickets from "./pages/support/Tickets";
import SupportMediation from "./pages/support/Mediation";
import SupportInternalFaq from "./pages/support/InternalFaq";

// Profile
import Verifications from "./pages/profile/Verifications";
import FaceScan from "./pages/profile/FaceScan";

function NotFound() {
  return <h1 className="p-6 text-xl">404 - Page introuvable</h1>;
}

export const router = createBrowserRouter(
  [
    // ---------------- PUBLIC ----------------
    {
      element: <PublicLayout />,
      children: [
        { path: "/", element: <Home /> },
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
        // PASSENGER
        {
          path: "/p",
          element: (
            <ProtectedRoute roles={["PASSENGER", "PASSENGER_DRIVER"]}>
              <PassengerDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/p/bookings/upcoming",
          element: (
            <ProtectedRoute roles={["PASSENGER", "PASSENGER_DRIVER"]}>
              <UpcomingBookings />
            </ProtectedRoute>
          ),
        },
        {
          path: "/p/payments/history",
          element: (
            <ProtectedRoute roles={["PASSENGER", "PASSENGER_DRIVER"]}>
              <PaymentsHistory />
            </ProtectedRoute>
          ),
        },
        {
          path: "/p/messages",
          element: (
            <ProtectedRoute roles={["PASSENGER", "PASSENGER_DRIVER"]}>
              <PassengerMessages />
            </ProtectedRoute>
          ),
        },
        {
          path: "/p/trips/:tripId",
          element: (
            <ProtectedRoute roles={["PASSENGER", "PASSENGER_DRIVER"]}>
              <TripDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "/p/booking/:tripId",
          element: (
            <ProtectedRoute roles={["PASSENGER", "PASSENGER_DRIVER"]}>
              <Booking />
            </ProtectedRoute>
          ),
        },
        {
          path: "/p/payment/:bookingId",
          element: (
            <ProtectedRoute roles={["PASSENGER", "PASSENGER_DRIVER"]}>
              <Payment />
            </ProtectedRoute>
          ),
        },
        {
          path: "/p/booking/confirmation/:bookingId",
          element: (
            <ProtectedRoute roles={["PASSENGER", "PASSENGER_DRIVER"]}>
              <BookingConfirmation />
            </ProtectedRoute>
          ),
        },

        // DRIVER
        {
          path: "/d",
          element: (
            <ProtectedRoute roles={["DRIVER", "PASSENGER_DRIVER"]}>
              <DriverDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/d/trips",
          element: (
            <ProtectedRoute roles={["DRIVER", "PASSENGER_DRIVER"]}>
              <MyTrips />
            </ProtectedRoute>
          ),
        },
        {
          path: "/d/trips/publish",
          element: (
            <ProtectedRoute roles={["DRIVER", "PASSENGER_DRIVER"]}>
              <PublishTrip />
            </ProtectedRoute>
          ),
        },
        {
          path: "/d/requests",
          element: (
            <ProtectedRoute roles={["DRIVER", "PASSENGER_DRIVER"]}>
              <Requests />
            </ProtectedRoute>
          ),
        },
        {
          path: "/d/earnings",
          element: (
            <ProtectedRoute roles={["DRIVER", "PASSENGER_DRIVER"]}>
              <Earnings />
            </ProtectedRoute>
          ),
        },

        // MIXED
        {
          path: "/m",
          element: (
            <ProtectedRoute roles={["PASSENGER_DRIVER"]}>
              <UnifiedDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/m/history",
          element: (
            <ProtectedRoute roles={["PASSENGER_DRIVER"]}>
              <MixedHistory />
            </ProtectedRoute>
          ),
        },

        // ADMIN
        {
          path: "/admin",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/users",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminUsers />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/trips",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminTrips />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/reports",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminReports />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/stats",
          element: (
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminStats />
            </ProtectedRoute>
          ),
        },

        // SUPPORT
        {
          path: "/support",
          element: (
            <ProtectedRoute roles={["SUPPORT"]}>
              <SupportConsole />
            </ProtectedRoute>
          ),
        },
        {
          path: "/support/tickets",
          element: (
            <ProtectedRoute roles={["SUPPORT"]}>
              <SupportTickets />
            </ProtectedRoute>
          ),
        },
        {
          path: "/support/mediation",
          element: (
            <ProtectedRoute roles={["SUPPORT"]}>
              <SupportMediation />
            </ProtectedRoute>
          ),
        },
        {
          path: "/support/internal-faq",
          element: (
            <ProtectedRoute roles={["SUPPORT"]}>
              <SupportInternalFaq />
            </ProtectedRoute>
          ),
        },

        // PROFILE
        {
          path: "/profile/verifications",
          element: (
            <ProtectedRoute
              roles={["PASSENGER", "DRIVER", "PASSENGER_DRIVER", "ADMIN", "SUPPORT"]}
            >
              <Verifications />
            </ProtectedRoute>
          ),
        },
        {
          path: "/verify/face",
          element: (
            <ProtectedRoute
              roles={["PASSENGER", "DRIVER", "PASSENGER_DRIVER", "ADMIN", "SUPPORT"]}
            >
              <FaceScan />
            </ProtectedRoute>
          ),
        },
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