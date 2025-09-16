# Signup Frontend — Multi‑Step Onboarding UI

This React app implements a visually engaging, multi-step signup and onboarding flow:

- Left panel: rotating image carousel with tagline.
- Right panel: progressive form with validations and feedback.
- Auth: email/password registration & login, plus Google/Apple placeholder flows.
- Onboarding: profile and preferences steps wired to backend.
- Responsive design and theme toggle.

## Getting Started

1) Install dependencies
   npm install

2) Configure environment
   Create a .env.local file at the project root (next to package.json) and define:

   REACT_APP_API_BASE_URL=https://vscode-internal-36146-beta.beta01.cloud.kavia.ai:3001

   Notes:
   - Do not include trailing slash.
   - For local development, point this to your FastAPI backend base URL.

3) Start the app
   npm start

The app will be available at http://localhost:3000

## Environment Variables

- REACT_APP_API_BASE_URL
  Base URL for the backend APIs (e.g., https://server.example.com or http://localhost:8000).
  Used by src/api.js to construct all API requests.

Important: CRA only exposes variables prefixed with REACT_APP_. Never commit secrets.

## API Integration

The app integrates with the following endpoints (from the Signup Backend OpenAPI):

- POST /auth/register — Create a new user
- POST /auth/login — Email/password login, returns JWT
- GET /auth/me — Fetch current user profile (requires Authorization: Bearer)
- POST /auth/social — Social sign-in placeholder
- GET /onboarding/progress — Fetch user onboarding map
- POST /onboarding/step — Update a specific onboarding step

See src/api.js for usage. JWT is stored in localStorage under auth_token.

## UX Notes

- Step 0: email/password sign-up or login, plus Google/Apple placeholder buttons.
- Step 1: basic profile fields saved via onboarding step "profile".
- Step 2: theme preferences saved via onboarding step "preferences".

Errors from API are shown inline; successes show a temporary banner.

## Testing

Run unit tests:
  npm test

## Accessibility

- Keyboard-accessible controls, ARIA labels for stepper and alerts.
- Color contrast targeted for dark UI.

## License

Internal template for KAVIA demo projects.
