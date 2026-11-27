import type { Request, Response } from 'express';
import { assetOnboardingSchema } from '../domain/schemas';
import { assetService } from '../services/asset-service';

export const onboardAsset = async (req: Request, res: Response) => {
  const payload = assetOnboardingSchema.parse(req.body);
  const asset = await assetService.onboard(payload);
  res.status(201).json(asset);
};

export const verifyAsset = async (req: Request, res: Response) => {
  const verified = await assetService.verify(req.params.assetId, req.body);
  res.json(verified);
};

export const tokenizeAsset = async (req: Request, res: Response) => {
  const tokenization = await assetService.tokenize(req.params.assetId, req.body);
  res.json(tokenization);
};

export const listAssets = async (_req: Request, res: Response) => {
  const assets = await assetService.list();
  res.json(assets);
};
