# Multi‑Step Signup Frontend (React)

This app provides a seamless onboarding experience with:
- Left image carousel + tagline.
- Right progressive signup form with email/password and Google/Apple placeholder sign-in.
- Integrated with backend APIs for register, login, and onboarding steps.

## Quick Start

1) Install deps:
   npm install

2) Set API base URL:
   Create .env.local with:
   REACT_APP_API_BASE_URL=https://vscode-internal-36146-beta.beta01.cloud.kavia.ai:3001

3) Run the app:
   npm start

Open http://localhost:3000

For details on flows and endpoints see README-ONBOARDING.md.

## Environment Variables

- REACT_APP_API_BASE_URL: Base URL for the backend. Must not include trailing slash.

Note: Do not commit actual .env.local secrets to source control.

## Scripts

- npm start — dev server
- npm test — tests
- npm run build — production build

## Notes

- JWT token is stored in localStorage under key auth_token.
- API integration code is in src/api.js.
- UI and layouts are in src/App.js and src/App.css.
