import React from "react";
import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

import Home from "./pages/public/Home";
import Search from "./pages/public/Search";
import SearchResults from "./pages/public/SearchResults";
import TripDetailsPublic from "./pages/public/TripDetailsPublic";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

import PassengerDashboard from "./pages/passenger/PassengerDashboard";
import DriverDashboard from "./pages/driver/DriverDashboard";
import UnifiedDashboard from "./pages/mixed/UnifiedDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SupportConsole from "./pages/support/SupportConsole";

import PublishTrip from "./pages/driver/PublishTrip";
import MyTrips from "./pages/driver/MyTrips";

import Booking from "./pages/passenger/Booking";
import Payment from "./pages/passenger/Payment";
import BookingConfirmation from "./pages/passenger/BookingConfirmation";
import TripDetails from "./pages/passenger/TripDetails";


function NotFound() {
  return <h1>404 - Page introuvable</h1>;
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/search", element: <Search /> },
      { path: "/search/results", element: <SearchResults /> },
      { path: "/trips/:tripId", element: <TripDetailsPublic /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
  element: <AppLayout />,
  children: [
    // Passager
    { path: "/p", element: <PassengerDashboard /> },
    { path: "/p/trips/:tripId", element: <TripDetails /> },
    { path: "/p/booking/:tripId", element: <Booking /> },
    { path: "/p/payment/:bookingId", element: <Payment /> },
    { path: "/p/booking/confirmation/:bookingId", element: <BookingConfirmation /> },

    // Conducteur
    { path: "/d", element: <DriverDashboard /> },
    { path: "/d/trips", element: <MyTrips /> },
    { path: "/d/trips/publish", element: <PublishTrip /> },

    // Mixte / Admin / Support (ce que tu avais déjà)
    { path: "/m", element: <UnifiedDashboard /> },
    { path: "/admin", element: <AdminDashboard /> },
    { path: "/support", element: <SupportConsole /> },
  ],
},

  { path: "*", element: <NotFound /> },
]);
