# AI Tooling Prompt Log

This file logs the prompts and AI assistance used throughout development of the Car Dealership Inventory System, in chronological order, using Claude (Anthropic) as an interactive pair-programming instructor.

---

## Session 1 — Planning & TDD Fundamentals (July 22, 2026)

**Prompt:** "Guide me step by step in building the Car Dealership Inventory System from scratch using Test-Driven Development. Explain each concept and implementation decision while helping me complete the project incrementally."
**Context:** Asked Claude to act as a TDD instructor to guide building the Car Dealership Inventory System from scratch, rather than generating the whole project at once.
**AI response summary:** Recommended starting with a tiny, throwaway TDD warmup exercise (a `calculator.add()` function) to build the red-green-refactor habit before touching the real project, since I was completely new to TDD.

**Prompt:** (follow-up) "Ran into an issue" / "Done" — worked through running the warmup pytest exercise, hit and resolved an initial setup issue.
**Context:** Practiced writing a failing test, confirming the failure, then writing minimal code to pass.
**AI response summary:** Walked through a checklist (venv activation, correct working directory, exact file naming pytest expects) to debug the environment issue.

**Prompt:** "Guide me in implementing the project through small, meaningful commits that demonstrate a gradual development process."
**Context:** Established the commit discipline for the whole project upfront.
**AI response summary:** Defined a consistent commit convention: one logical change per commit, RED test committed separately from GREEN implementation, refactors as their own commits, and an AI co-author trailer on any commit where Claude generated or substantially suggested code.

**Prompt:** "Ensure the project includes an up-to-date PROMPTS.md log and appropriate AI co-author commit trailers where applicable."
**Context:** Set up the AI-transparency requirements from the kata (PROMPTS.md + `Co-authored-by` trailers) at the very start of the project rather than retrofitting them later.
**AI response summary:** Provided the initial PROMPTS.md template and the exact git commit trailer format to use going forward.

---

## Session 2 — Project Scaffold & Backend Auth (July 22, 2026)

**Prompt:** Assist me in building the FastAPI backend, starting with user registration and JWT-based login using TDD.
**Context:** Worked through the initial repo structure, dependency installation (FastAPI, SQLAlchemy, python-jose, passlib, pytest, httpx), and the first Red-Green-Refactor cycles for:
- Health check endpoint
- User registration (happy path + duplicate email → 409)
- Login with JWT issuance (correct credentials → token, wrong password → 401)
- An auth guard dependency (`get_current_user`) protecting routes via `OAuth2PasswordBearer`

**AI response summary:** For each feature, Claude provided the RED test first, I ran it and confirmed the actual failure reason, then Claude provided the minimal implementation to go GREEN, which I verified myself before committing.

**Real debugging encountered:**
- A `passlib`/`bcrypt` function not being recognized — traced to the file not having saved/the code not actually being present, resolved by re-checking file contents.
- An editor (VS Code) linter false alarm about `passlib.context` not being found — traced to the editor's Python interpreter setting pointing at the global install instead of the project's virtual environment, not an actual test failure.
- A missing `create_access_token` function — same root cause, code not fully saved before running.

---

## Session 3 — Vehicle CRUD, Search, and RBAC (July 22, 2026)

**Prompt:** Help me implement vehicle creation, listing, search, update, and admin-only delete features.
**Context:** Extended the backend with the `Vehicle` model and the following endpoints, each driven by a failing test written before implementation:
- `POST /api/vehicles` (create)
- `GET /api/vehicles` (list)
- `GET /api/vehicles/search` (filter by make, model, category, price range)
- `PUT /api/vehicles/{id}` (update)
- `DELETE /api/vehicles/{id}` (admin only, via a new `get_current_admin_user` dependency)

**AI response summary:** Highlighted a routing-order consideration (FastAPI matches `/search` against `/{vehicle_id}` if not registered first) and had me place `/search` above any path-parameter routes. Also flagged a genuine "false-positive green" moment: a test for "update nonexistent vehicle returns 404" passed *before* the PUT route existed at all, because an unmatched route also returns 404 — coincidentally correct, not actually correct. Logged this explicitly rather than treating the test as done, and re-verified after the real route was implemented.

**Prompt:** Suggest a simple approach for implementing administrator access, as the assessment does not specify how users should become admins.
**My choice:** Add an `is_admin` field to the registration request body (simplest option appropriate for an assessment).
**AI response summary:** Implemented this with a test-first approach (register with `is_admin: true` → response reflects it; register without it → defaults to `false`).

---

## Session 4 — Purchase, Restock, and a Real Bug Found via Manual Testing (July 22, 2026)

**Prompt:** Help me implement vehicle purchase and admin-only restock functionality using a Test-Driven Development approach, and recommend an appropriate HTTP status code for out-of-stock purchases.
**My choice:** `409 Conflict` for purchasing when quantity is already zero.
**AI response summary:** Implemented both endpoints test-first, including the out-of-stock conflict case and the admin-only restriction on restock (403 for regular users).

**Prompt:** Help me verify administrator login and troubleshoot why admin-only features are not visible after successful authentication.
**Context:** Real bug found through manual, hands-on testing rather than through the automated test suite.
**AI response summary:** Diagnosed that the JWT only ever encoded `{"sub": user.email}` and never included the `is_admin` flag, so the frontend had no way to know the user was an admin even though the database record was correct. Wrote a failing test first (`test_login_token_contains_is_admin_claim`) to prove the bug, then fixed the login route to include `is_admin` in the token payload. Emphasized logging out and back in afterward, since old tokens issued before the fix wouldn't carry the new claim.

---

## Session 5 — React Frontend (July 22, 2026)

**Prompt:** Guide me through building the React frontend from scratch, explaining the fundamentals along the way, while prioritizing backend testing over frontend testing.
**Context:** Built, in order:
- Vite + Tailwind scaffold
- An `AuthContext` for centralized login state (token, decoded user, login/logout)
- A `ProtectedRoute` guard component
- Login and Register pages (controlled form inputs, calling the backend via a shared `api/client.js` helper)
- A Dashboard page fetching and displaying vehicles as cards, with a search bar
- A separate Add/Edit vehicle form page (`/vehicles/new` and `/vehicles/:id/edit`), reusing one component for both modes based on the presence of a URL parameter
- A restock action using a simple `prompt()` for the amount

**AI response summary:** Explained core React concepts as they came up (components, `useState`, `useEffect`, controlled inputs, `useParams`, why hooks must be called inside component functions) since this was my first hands-on React project. Also set up CORS on the backend (`CORSMiddleware`) so the frontend on port 5173 could call the backend on port 8000.

**Real bug found:** A `useNavigate()` hook was accidentally placed outside the component function in `Dashboard.jsx`, which would throw an invalid-hook-call error. Corrected by moving it inside the component body, alongside an explanation of why React hooks require this.

**Another real bug found:** Running `pytest` was silently wiping the same SQLite database file (`dealership.db`) used by the actual running dev server, since every test file imported the same `engine` and called `drop_all`/`create_all` on it. This meant a manually-created admin account would "disappear" every time the test suite ran. Root-caused and fixed with a `conftest.py` that sets a `DATABASE_URL` environment variable pointing tests at an isolated `test_dealership.db` file, set before the `app.database` module is ever imported.

---

## Session 6 — Visual Design Pass (July 22, 2026)

**Prompt:** "Help me redesign the application's user interface with a modern, clean, and professional look while keeping the implementation simple."
**Context:** Asked for a more distinctive, considered visual design rather than default Tailwind styling.
**AI response summary:** Proposed a deliberate design system ("DealershipOS"): a navy/orange/slate color palette, a Sora + Inter type pairing, and a signature stock-status color stripe on each vehicle card (green/amber/red) as a functional-not-decorative element. Applied this consistently across the Navbar, Dashboard, VehicleCard, SearchBar, Login, Register, and VehicleForm pages so the app reads as one cohesive product.

**Debugging along the way:** Walked through fixing a duplicated header (old inline header left in place alongside the new shared `Navbar` component) by identifying and removing the redundant JSX block and unused `logout` destructure.

---

## Session 7 — Final Polish (July 22, 2026)

**Prompt:** Help me to generate a complete README.md and PROMPTS.md as final deliverables.
**Context:** Consolidated the entire development history into comprehensive documentation, including the full test report, an API reference table, setup instructions, and this AI usage log.
**AI response summary:** Generated both files based on the actual, real development session above — including the genuine bugs found and fixed — rather than a generic or idealized account of the process.

---

## Summary of AI Usage

Claude was used throughout as an interactive TDD/React instructor: proposing failing tests before implementation, explaining unfamiliar concepts (TDD cycles, React hooks, JWT claims, CORS, Tailwind v4 setup) as they came up, and helping debug real issues that surfaced through actual test runs and manual testing — including a JWT claim bug, a test-database isolation bug, a stray hook-placement bug, and a couple of coincidentally-passing tests that needed re-verification once real behavior was implemented. Every piece of AI-suggested code was run and verified against real test output or manual testing before being committed, rather than accepted at face value.