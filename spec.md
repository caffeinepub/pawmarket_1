# Pet Services Marketplace

## Current State
New project. Only scaffolded files exist (empty Motoko actor, no frontend components).

## Requested Changes (Diff)

### Add
- Full pet services marketplace with 5 categories: Grooming, Walker, Trainer, Pet Transport, Dog Mating
- Three user roles: Pet Parent, Service Provider, Admin
- Separate registration/login flows for Pet Parents and Service Providers
- Home page with hero section and category browsing cards
- Category listing page showing service provider cards with name, description, price, rating
- Service provider profile page with full details (bio, services offered, pricing, availability, reviews)
- Booking/request system: Pet Parents send booking requests to providers; providers accept/decline
- Pet Parent dashboard: manage pet profiles (name, breed, age, photo), view booking history and status
- Service Provider dashboard: manage service listing (description, pricing, availability), view/respond to booking requests
- Admin panel: manage categories, users (approve/suspend), and listings
- Sample seed data for providers, pets, and bookings

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan

### Backend (Motoko)
- User management: register, login (via authorization component), roles (petParent, serviceProvider, admin)
- Service categories: fixed list of 5 categories
- Provider profiles: CRUD for service provider listings (category, description, price, availability, rating)
- Pet profiles: CRUD for pet parent's pets (name, breed, age)
- Booking requests: create request, update status (pending/accepted/declined/completed), list by user
- Reviews: submit rating+comment on completed bookings
- Admin functions: list all users, suspend/activate users, list all providers, approve/remove listings
- Seed data for demo purposes

### Frontend (React + TypeScript + Tailwind)
- Landing / Home page: hero banner, 5 category cards, featured providers
- Auth pages: register (choose role), login
- Category page: filter/browse providers by category with cards
- Provider profile page: full details, book now CTA
- Booking flow: request form (date, notes), confirmation
- Pet Parent dashboard: pet profiles CRUD, bookings list with status badges
- Service Provider dashboard: listing management, incoming bookings with accept/decline actions
- Admin panel: users table, provider listings table, category management
- Responsive, pet-themed design using Tailwind CSS
