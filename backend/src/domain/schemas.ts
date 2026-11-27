import { z } from 'zod';
import {
  ASSET_CATEGORIES,
  ASSET_STATUSES,
  KYC_STATUSES,
  LOAN_STATUSES,
  REPAYMENT_CYCLES,
  USER_ROLES
} from './constants';

export const createUserSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional(),
  role: z.enum([...USER_ROLES]).optional(),
  country: z.string().min(2),
  hederaAccountId: z.string().optional()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const kycUpdateSchema = z.object({
  status: z.enum([...KYC_STATUSES]),
  notes: z.string().optional()
});

export const assetOnboardingSchema = z.object({
  ownerId: z.string().cuid(),
  name: z.string().min(3),
  category: z.enum([...ASSET_CATEGORIES]),
  location: z.string().min(3),
  valuationUsd: z.number().positive(),
  fractionalGoal: z.number().int().positive().max(10_000_000),
  complianceUrl: z.string().url().optional(),
  surveyorReportUrl: z.string().url().optional()
});

export type AssetOnboardingInput = z.infer<typeof assetOnboardingSchema>;

export const assetVerificationSchema = z.object({
  status: z.enum([...ASSET_STATUSES]).default('VERIFIED'),
  complianceUrl: z.string().url(),
  surveyorReportUrl: z.string().url()
});

export const tokenizeAssetSchema = z.object({
  decimals: z.number().int().min(0).max(6).default(2),
  pricePerShareUsd: z.number().positive(),
  treasuryAccountId: z.string().optional(),
  memo: z.string().optional()
});

export const loanApplicationSchema = z.object({
  borrowerId: z.string().cuid(),
  assetId: z.string().cuid().optional(),
  amountUsd: z.number().positive(),
  interestApr: z.number().positive().max(100),
  termMonths: z.number().int().positive(),
  repaymentCycle: z.enum([...REPAYMENT_CYCLES]).default('MONTHLY')
});

export type LoanApplicationInput = z.infer<typeof loanApplicationSchema>;

export const remittanceSchema = z.object({
  senderId: z.string().cuid(),
  receiverPhone: z.string().min(8),
  receiverAccountId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().min(3).max(5),
  mobileMoneyProvider: z.string().optional()
});

export const impactFilterSchema = z.object({
  country: z.string().optional(),
  assetCategory: z.enum([...ASSET_CATEGORIES]).optional()
});

export const loanStatusUpdateSchema = z.object({
  status: z.enum([...LOAN_STATUSES]),
  notes: z.string().optional()
});
