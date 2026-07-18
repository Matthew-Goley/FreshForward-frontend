# FreshForward Overview/Product Scope

## 1. Product Summary
FreshForward's web app should allow users to purchase food from all restaurants within MAARA. Restaurants will be able to easily create listings and customers will be able to purchase that food, and see updates on when it will arrive.

## 2. Problem / Motivation
Solving a major problem by routing a typical harmful practice into a sustainable opportunity. Food within the FreshForward website will be heavily discounted because it is either misshapen or near expiry, allowing those with lower income to get fresh, nutritious and real food at a price they can afford.

## 3. Target Users
### Restaurants (Supply side)
Currently, only restaurants within MAARA or a similar organization we partner with. Restaurants apply to create an account; every application requires **manual approval** before the account is active. All supplier/restaurant accounts represent an ACTUAL establishment.

### Customers (Demand side)
Regular, lower income people. They can browse the site publicly without an account. An account is required to place an order. Browsing works like DoorDash/Instacart — customers order food, pay, and see pickup details.

## 4. Core Features
### Restaurant-facing
- Create/edit/delete listings
- Create/edit/delete profile (application-gated — pending manual approval before going live)
- See order notifications when someone buys (customer name, order details)
- Specify pickup time window per listing
- Payment updates, balances (minimal — Stripe Connect handles payout mechanics, not a fintech product)

### Customer-facing
- Browse/search listings (public, no account needed)
- Create account (required to purchase)
- Purchase flow — instant charge at time of order, no restaurant accept/confirm step
- View pickup time and order details
- Create/edit/delete profile

## 5. Fulfillment & Logistics
**Curbside pickup only for MVP — no delivery.**
- Each listing includes a restaurant-specified pickup time window.
- Order pickup verification is **honor system** for MVP (no order code/QR verification).

## 6. Payments
- **Stripe Connect Express** — customer pays FreshForward directly, Stripe splits payout between restaurant and platform fee automatically.
- Charge happens instantly at order time (no restaurant confirmation step).
- Fee structure still to be finalized — leaning toward a small flat per-order fee (rather than pure percentage) since items are already heavily discounted and percentage fees disproportionately hurt low-price items. Whether Stripe's processing fee is absorbed by FreshForward or passed to the customer as a service fee is still open — doesn't block frontend MVP, can hardcode a placeholder fee for now.

## 7. Out of Scope (v1)
- Mobile app
- Delivery (curbside pickup only for MVP)
- Rewards/loyalty programs
- Order pickup verification (QR/code system) — honor system for MVP
- Restaurant accept/confirm step on orders
- Admin approval dashboard — manual approval handled outside the app (e.g. direct DB/founder review) for MVP
- Extremely frictionless anything — bare bones functional MVP

## 8. Tech Stack
See frontend/backend READMEs. Frontend: React + TypeScript + Vite + Tailwind CSS. Backend: FastAPI + PostgreSQL.

## 9. Open Questions
- Platform fee structure: flat fee vs. percentage, and whether Stripe's processing fee is absorbed or passed to customer
- Geographic scope: MVP is technically usable nationwide, but in-app copy/marketing will target the Massachusetts area only