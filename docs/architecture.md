# AfriAsset Platform Architecture

## Vision
AfriAsset delivers inclusive, Hedera-powered finance for African communities by:
- Tokenizing verifiable real-world assets (RWAs) such as farms, solar mini-grids, and affordable housing
- Routing compliant liquidity to community projects through fractional ownership
- Offering risk-aware credit scored against tokenized collateral
- Powering low-cost remittances tied to mobile money rails

## High Level Components
1. **Backend (Node + Express + Prisma)**
   - REST API for onboarding, verification, tokenization, loans, remittances, and analytics
   - Integrates with Hedera Token Service via `@hashgraph/sdk`
   - Persists platform state in SQLite (production-ready for Postgres)
   - Provides deterministic scoring heuristics to automate loan decisions
2. **Frontend (React + Vite + Tailwind)**
   - Operator dashboard to onboard assets, manage loans, and trigger remittances
   - Real-time insights via React Query and lightweight data visualizations
   - Mobile-first design to align with low-bandwidth contexts
3. **Prisma ORM**
   - Models users, assets, fractional tokens, loans, and remittances
   - Enforces referential integrity and simplifies migrations
4. **Hedera Integration Layer**
   - `createFractionalToken` wraps Hedera SDK for RWA token issuance
   - `transferStablecoin` demonstrates stablecoin payout flows to beneficiaries
   - Gracefully falls back to simulations if credentials are absent

## Data Flow Overview
1. **User Onboarding**: Cooperative agents register borrowers/investors → stored in `User` table with KYC status tracking.
2. **Asset Onboarding**: Field agents submit asset metadata and due diligence links → `Asset` record created with `PENDING` status.
3. **Verification**: Compliance officers attach verified documents → status moves to `VERIFIED`.
4. **Tokenization**: Platform treasury triggers Hedera token creation → `FractionalToken` record stored; asset status updates to `TOKENIZED`.
5. **Loan Origination**: Borrowers request financing; RWA collateral improves score; approved loans recorded in `Loan` table.
6. **Remittance**: Diaspora senders initiate transfers; attempts to execute Hedera stablecoin transfer; success recorded in `Remittance`.
7. **Impact Analytics**: Aggregated metrics surface households served, total valuation, and SDG alignment.

## Security & Trust
- Hedera operator credentials loaded from environment only when required
- Prisma enforces unique constraints for user phone numbers and asset ownership
- Zod validation sanitizes all inbound API payloads
- Pino structured logging for auditability

## Scaling Considerations
- Swap SQLite for Postgres or Hedera Guardian-compatible store in production
- Extend Hedera Smart Contract Service to automate yield distribution
- Integrate telco/USSD gateways using the remittance service hooks
- Add decentralized identity (DID) verification for cooperatives and borrowers

## Deployment Notes
- Backend deployable as containerized service (Dockerfile TBD)
- Frontend builds to static assets for CDN hosting
- Hedera credentials and treasury accounts managed via HashPack or institutional custody
