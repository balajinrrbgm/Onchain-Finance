# AfriAsset: Hedera-Powered Inclusive Finance

<picture>
	<source media="(prefers-color-scheme: dark)" srcset="frontend/src/assets/afriasset-logo.svg" />
	<img alt="AfriAsset" src="frontend/src/assets/afriasset-logo.svg" width="360" />
</picture>

AfriAsset is a full-stack platform built for Hedera Hack Africa (Track 1: Onchain Finance & Real-World Assets). It unlocks community wealth by digitizing real assets, scoring equitable credit, and simplifying cross-border remittances for underbanked Africans.

## Platform Highlights
- **RWA Tokenization**: Field-verified assets become fungible Hedera tokens, enabling fractional ownership and liquidity.
- **Impact Lending**: Automated risk scoring for loans backed by tokenized collateral, with transparent lifecycle tracking.
- **Hybrid Remittances**: Stablecoin rails bridge diaspora capital to mobile money networks with graceful fallbacks.
- **Impact Intelligence**: Real-time analytics surface SDG alignment, capital mobilized, and beneficiaries served.

## Repository Structure
```
backend/   # Express + Prisma API integrating Hedera SDK
frontend/  # React + Vite dashboard for operators, investors, and agents
contracts/ # Smart-contract ready workspace (extendable for HTS/SCS automation)
docs/      # Architecture, pitch collateral, and product notes
infra/     # Deployment scripts and IaC stubs (placeholder)
```

## Prerequisites
- Node.js 20+
- npm 10+
- (Optional) Hedera Testnet account + operator private key

## Backend Setup
```powershell
cd backend
copy .env.example .env
# Update env variables, especially HEDERA_ACCOUNT_ID / HEDERA_PRIVATE_KEY
npm install
npx prisma migrate dev --name init
npm run dev
```

### Running Backend Tests
```powershell
npm test
```
Tests use SQLite and mock Hedera interactions, ensuring deterministic CI.

## Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173` — API requests proxy to `http://localhost:4000`.

### Using the Logo Component
Import and use the responsive logo inside your React layout or navigation bar:
```tsx
import { Logo } from './components/Logo';

export const Header = () => (
	<header className="flex items-center gap-4 p-4">
		<Logo size={48} />
		<h1 className="text-xl font-semibold">AfriAsset Dashboard</h1>
	</header>
);
```
Show emblem-only variant (without wordmark) using `hideWordmark`:
```tsx
<Logo hideWordmark size={40} />
```

### Raster Logo Assets
Pre-generated 480×480 PNG and JPEG versions are available (each < 2MB):

```
frontend/public/branding/afriasset-emblem-480.png
frontend/public/branding/afriasset-emblem-480.jpg
```

Regenerate them if you modify the emblem SVG:
```powershell
cd frontend
npm run generate:logo
```

## Containerized Deployment
```powershell
cd infra
docker compose build
docker compose up
```
- `backend` exposes `http://localhost:4000` with Prisma migrations executed automatically.
- `frontend` serves the production bundle at `http://localhost:8080` with `/api` proxied to the backend service.
- Provide Hedera credentials via environment variables (e.g., `HEDERA_ACCOUNT_ID`, `HEDERA_PRIVATE_KEY`) before starting the stack if you plan to hit tokenization endpoints.

## End-to-End Demo Flow
1. **Register Users** via `POST /api/users` (agents, borrowers, investors).
2. **Onboard Assets** in UI or `POST /api/assets` with valuation + documentation.
3. **Verify & Tokenize** with `POST /api/assets/:id/verify` then `/tokenize` (requires Hedera creds).
4. **Originate Loans** using the Loan Desk or `POST /api/loans` to score borrowers.
5. **Send Remittances** through the Remittance page; Hedera stablecoin transfer executes when treasury + token configured.
6. **Track Impact** using dashboard analytics for capital mobilized and households served.

## Production Hardening Roadmap
- Plug into Hedera Guardian for verifiable credentials and ESG reporting.
- Deploy HTS + smart-contract guards for on-chain compliance and yield streaming.
- Integrate telco USSD APIs for low-end devices and offline onboarding.
- Expand credit scoring with alternative data (satellite, cooperative histories).

## License
MIT — customize freely for the hackathon and beyond.
