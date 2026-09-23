# Ferry — AI Travel Aggregator & Personalized Planner

A production-shaped React frontend for a curated-trip booking platform with an
AI travel planner, seat booking, payments simulation, reviews, and a
notification center — built to run entirely on mock data today and connect to
a real Spring Boot backend later without touching a single page component.

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

Demo login accepts any email/password. OTP verification code is `1234`.

## Backend connection

Every page calls functions from `src/services/*Api.js` — never mock JSON
directly. Each service function looks like:

```js
export async function getTripById(id) {
  if (USE_MOCK) return mockDelay(trips.find(t => t.id === id));
  return http.get(`/trips/${id}`);
}
```

To run against your Spring Boot backend:

1. Set `VITE_API_BASE_URL=http://localhost:8080/api` in `.env`.
2. Start the backend with `mvn spring-boot:run`.
3. Start the frontend with `npm run dev`.

No component changes needed — as long as your backend's response shapes match
the mock JSON in `src/mock/`, everything keeps working.

## Project structure

```
src/
  mock/          Mock JSON data (trips, buses, seats, hotels, weather,
                  reviews, notifications, users, conversations, travelPlans,
                  transport, payments)
  services/       API abstraction layer (one file per domain)
  context/        Global state: AuthContext, NotificationContext, BookingContext
  components/
    layout/       Navbar, MobileHeader, BottomNav, Layout, ProtectedRoute
    common/       Stamp (passport-stamp badge), StarRating, Skeleton, EmptyState, Badge
    trip/         TripCard, CategoryChip
    chat/         FloatingAssistant (the bottom-right AI chatbot)
    notifications/ NotificationPanel
  pages/          One file per route (see routing below)
```

## Routes

```
/                       Home / dashboard
/search                 Search & filter trips
/trips/:tripId          Trip details
/trips/:tripId/seats    Seat selection
/trips/:tripId/feedback Post-trip feedback
/checkout               Passenger details (protected)
/payment                Payment simulation (protected)
/booking/success        Booking confirmation (protected)
/history                My bookings / plans / documents (protected)
/planner                AI planner conversation
/planner/result/:planId Generated travel plan preview
/profile                Profile & preferences (protected)
/login /register /verify
```

## Design system

- Fonts: Fraunces (display/serif) + Inter (body) — loaded via Google Fonts in `src/index.css`
- Palette: warm sand background, coral primary accent, teal secondary/success, amber for ratings — defined as CSS variables in the `@theme` block of `src/index.css`, so Tailwind utility classes like `bg-coral`, `text-teal`, `bg-sand-2` work everywhere
- Signature element: the "passport stamp" badge (`src/components/common/Stamp.jsx`) — used on trip cards, hero banners, and the chat's matched-trip card to reinforce social proof

## Notes on images

Trip photography currently points to real Wikimedia Commons photos (CC
licensed) as realistic placeholders. Swap the `banner` / `gallery` URLs in
`src/mock/trips.json` for your own asset library or user-uploaded photos at
launch — no component changes required, since `TripCard` and `TripDetails`
just render whatever URL is in the data.

## What's mocked vs. what's real

Per the product spec, the frontend never treats itself as the source of
truth for booking confirmation, payment status, or final pricing — the mock
`paymentApi.js` and `bookingApi.js` simulate success/failure, but a real
backend must confirm both once connected.
