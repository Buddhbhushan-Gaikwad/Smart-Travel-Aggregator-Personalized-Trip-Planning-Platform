import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { BookingProvider } from "./context/BookingContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Home from "./pages/Home";
import Search from "./pages/Search";
import TripDetails from "./pages/TripDetails";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";
import Feedback from "./pages/Feedback";
import History from "./pages/History";
import Planner from "./pages/Planner";
import PlannerResult from "./pages/PlannerResult";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <BookingProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/trips" element={<Search />} />
                <Route path="/trips/:tripId" element={<TripDetails />} />
                <Route path="/trips/:tripId/seats" element={<SeatSelection />} />
                <Route path="/trips/:tripId/feedback" element={<Feedback />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/planner/result/:planId" element={<PlannerResult />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/booking/success" element={<BookingSuccess />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BookingProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
