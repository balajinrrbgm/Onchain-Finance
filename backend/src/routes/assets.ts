import { Router } from 'express';
import { listAssets, onboardAsset, tokenizeAsset, verifyAsset } from '../controllers/asset-controller';

export const assetRouter = Router();

assetRouter.post('/', onboardAsset);
assetRouter.post('/:assetId/verify', verifyAsset);
assetRouter.post('/:assetId/tokenize', tokenizeAsset);
assetRouter.get('/', listAssets);
