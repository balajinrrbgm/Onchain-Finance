import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { StatCard } from '../components/StatCard';

interface AssetView {
  id: string;
  name: string;
  category: string;
  valuationUsd: number;
  tokenization?: {
    hederaTokenId: string;
    totalShares: number;
    pricePerShareUsd: number;
  } | null;
}

interface ImpactMetrics {
  tokenizedAssets: number;
  activeLoans: number;
  totalValuationUsd: number;
  totalLoansUsd: number;
  estimatedHouseholdsServed: number;
  sdgAlignment: string[];
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export const DashboardPage = () => {
  const impactQuery = useQuery<ImpactMetrics>({ queryKey: ['impact'], queryFn: async () => (await api.get('/analytics/impact')).data });
  const assetsQuery = useQuery<AssetView[]>({ queryKey: ['assets'], queryFn: async () => (await api.get('/assets')).data });

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-slate-700">Impact Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <StatCard title="Tokenized RWAs" value={impactQuery.data?.tokenizedAssets.toString() ?? '—'} subtitle="Assets fractionalized and listed" />
          <StatCard title="Capital Mobilized" value={impactQuery.data ? formatter.format(impactQuery.data.totalValuationUsd) : '—'} subtitle="Total value of digitized assets" />
          <StatCard title="Households Served" value={impactQuery.data?.estimatedHouseholdsServed.toString() ?? '—'} subtitle="Projected beneficiaries across Africa" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-700">Tokenized Opportunities</h2>
        <p className="text-sm text-slate-500">Back inclusive projects with impact-backed yields.</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Asset</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Valuation</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Token ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {assetsQuery.data?.map((asset) => (
                <tr key={asset.id}>
                  <td className="px-4 py-3 text-sm text-slate-700">{asset.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{asset.category}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatter.format(asset.valuationUsd)}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{asset.tokenization?.hederaTokenId ?? 'Pending'}</td>
                </tr>
              )) ?? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-sm text-slate-400">
                    No tokenized assets yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
