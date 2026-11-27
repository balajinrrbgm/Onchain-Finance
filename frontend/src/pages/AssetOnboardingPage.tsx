import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../api/client';

const categories = [
  { value: 'FARM', label: 'Agriculture & Farms' },
  { value: 'HOUSING', label: 'Affordable Housing' },
  { value: 'SOLAR', label: 'Renewable Energy' },
  { value: 'SME_EQUIPMENT', label: 'SME Equipment' },
  { value: 'RARE_MATERIAL', label: 'Critical Minerals' }
];

export const AssetOnboardingPage = () => {
  const [ownerId, setOwnerId] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    category: 'FARM',
    location: '',
    valuationUsd: 0,
    fractionalGoal: 0,
    complianceUrl: '',
    surveyorReportUrl: ''
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formState,
        ownerId,
        valuationUsd: Number(formState.valuationUsd),
        fractionalGoal: Number(formState.fractionalGoal)
      };
      const { data } = await api.post('/assets', payload);
      return data;
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="max-w-3xl space-y-8">
      <section className="bg-white rounded-xl shadow px-6 py-6">
        <h2 className="text-lg font-semibold text-slate-700">Onboard a Real-World Asset</h2>
        <p className="text-sm text-slate-500 mb-4">Submit due-diligence ready projects for tokenization and community funding.</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Owner ID</span>
            <input
              value={ownerId}
              onChange={(event) => setOwnerId(event.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Use the ID returned from /users"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Asset Name</span>
            <input
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Category</span>
            <select
              value={formState.category}
              onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-600">Location</span>
              <input
                value={formState.location}
                onChange={(event) => setFormState((prev) => ({ ...prev, location: event.target.value }))}
                className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-600">Valuation (USD)</span>
              <input
                type="number"
                min={0}
                value={formState.valuationUsd}
                onChange={(event) => setFormState((prev) => ({ ...prev, valuationUsd: Number(event.target.value) }))}
                className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-600">Fractional Goal (Tokens)</span>
              <input
                type="number"
                min={0}
                value={formState.fractionalGoal}
                onChange={(event) => setFormState((prev) => ({ ...prev, fractionalGoal: Number(event.target.value) }))}
                className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Compliance Document URL</span>
            <input
              value={formState.complianceUrl}
              onChange={(event) => setFormState((prev) => ({ ...prev, complianceUrl: event.target.value }))}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Surveyor Report URL</span>
            <input
              value={formState.surveyorReportUrl}
              onChange={(event) => setFormState((prev) => ({ ...prev, surveyorReportUrl: event.target.value }))}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://"
            />
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Submitting...' : 'Submit Asset'}
          </button>
        </form>

        {mutation.isSuccess && (
          <p className="text-sm text-emerald-600 mt-4">Asset submitted! Next step: field verification and tokenization.</p>
        )}

        {mutation.isError && (
          <p className="text-sm text-red-500 mt-4">Submission failed: {(mutation.error as Error).message}</p>
        )}
      </section>
    </div>
  );
};

export default AssetOnboardingPage;
