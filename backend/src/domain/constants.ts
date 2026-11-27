export const USER_ROLES = ['ADMIN', 'BORROWER', 'INVESTOR', 'FIELD_AGENT'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const KYC_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export type KycStatus = (typeof KYC_STATUSES)[number];

export const ASSET_CATEGORIES = ['FARM', 'HOUSING', 'SOLAR', 'SME_EQUIPMENT', 'RARE_MATERIAL'] as const;
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export const ASSET_STATUSES = ['PENDING', 'VERIFIED', 'TOKENIZED', 'LISTED'] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export const LOAN_STATUSES = ['PENDING', 'APPROVED', 'DISBURSED', 'REPAID', 'DEFAULTED'] as const;
export type LoanStatus = (typeof LOAN_STATUSES)[number];

export const REPAYMENT_CYCLES = ['WEEKLY', 'BIWEEKLY', 'MONTHLY'] as const;
export type RepaymentCycle = (typeof REPAYMENT_CYCLES)[number];

export const REMITTANCE_STATUSES = ['PENDING', 'SUCCESS', 'FAILED'] as const;
export type RemittanceStatus = (typeof REMITTANCE_STATUSES)[number];
