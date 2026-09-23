# Ferry — Smart Travel Aggregator & Personalized Trip Planning Platform

## The Problem

Planning a trip in India today means juggling five different tabs — one for
buses, one for hotels, one for weather, one for "things to do" blogs, and a
WhatsApp group full of half-decided plans. There's no single place where a
traveler can browse curated, ready-to-book group trips **and** get help
figuring out where to go in the first place if they don't already know.

## The Idea

Ferry is a travel aggregator and booking platform built around two things
working together:

1. **Curated trips** — pre-packaged group trips (Rishikesh rafting camps,
   Goa beach getaways, etc.) with real pricing, itineraries, seat selection,
   and checkout, the same way you'd book a bus or event ticket.
2. **An AI trip planner** — for travelers who don't have a destination in
   mind yet, a conversational assistant that asks about budget, group size,
   and interests, and matches them to a trip or generates a custom plan.

The goal isn't just another booking form — it's collapsing "I don't know
where to go" and "book me a seat" into one flow.

## How It Works

- **Frontend** (`/ferry`) — React + Vite. Handles trip browsing, trip
  details, seat selection, checkout, booking history, reviews, and the AI
  planner chat interface. Can run entirely on local mock data
  (`VITE_USE_MOCK=true`) for frontend-only development, or against the real
  backend.
- **Backend** (`/ferry-backend`) — Spring Boot + PostgreSQL. Owns trips,
  users/auth (JWT), buses, seats, bookings, payments, and reviews as real
  persisted data, plus lightweight endpoints for weather, chat, and the
  planner (currently rule-based, built to be swapped for a real LLM/weather
  API integration next).

Each side has its own `README.md` with setup steps — start with whichever
you're working on.

## What Makes It Different

- **One flow, two entry points** — browse-first *or* plan-first, both land
  in the same booking system instead of being separate products bolted
  together.
- **Real seat-level booking**, not just a "request a callback" form — live
  seat maps, holds, and confirmed bookings tied to actual buses and trips.
- **Built mock-first, backend-second** — the entire frontend was designed
  and validated against realistic mock data before a single backend
  endpoint existed, so the API contracts were driven by actual UI needs
  rather than guessed upfront.
- **Signature visual identity** — a "passport stamp" badge motif used
  throughout for ratings and traveler counts, real photography instead of
  generic stock icons, built around a sand/coral/teal/amber palette.

## Project Structure

```
Smart-Travel-Aggregator-Personalized-Trip-Planning-Platform/
├── ferry/              → Frontend (React + Vite + Tailwind)
│   └── README.md       → Frontend setup, mock-mode toggle
├── ferry-backend/       → Backend (Spring Boot + PostgreSQL)
│   └── README.md       → Backend setup, DB seeding, API wiring
└── README.md            → You are here
```

## Status

Core booking flow (trips, auth, seats, bookings, payments, reviews) is
fully wired frontend-to-backend. Weather, chat, and AI planner are
functional with rule-based logic and are the next area planned for real
API/LLM integration.

## Author

Buddhbhushan Gaikwad
