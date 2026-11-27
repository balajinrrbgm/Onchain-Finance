import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../api/client';

export const LoanDeskPage = () => {
  const [formState, setFormState] = useState({
    borrowerId: '',
    assetId: '',
    amountUsd: 0,
    interestApr: 18,
    termMonths: 12,
    repaymentCycle: 'MONTHLY'
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/loans', {
        ...formState,
        amountUsd: Number(formState.amountUsd),
        interestApr: Number(formState.interestApr),
        termMonths: Number(formState.termMonths)
      });
      return data;
    }
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <section className="bg-white rounded-xl shadow px-6 py-6">
        <h2 className="text-lg font-semibold text-slate-700">Impact Loan Origination</h2>
        <p className="text-sm text-slate-500 mb-4">Blend community capital with RWA collateral to extend credit to underbanked founders.</p>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Borrower ID</span>
            <input
              value={formState.borrowerId}
              onChange={(event) => setFormState((prev) => ({ ...prev, borrowerId: event.target.value }))}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Collateral Asset ID (optional)</span>
            <input
              value={formState.assetId}
              onChange={(event) => setFormState((prev) => ({ ...prev, assetId: event.target.value }))}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Link verified asset"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-600">Loan Amount (USD)</span>
              <input
                type="number"
                min={0}
                value={formState.amountUsd}
                onChange={(event) => setFormState((prev) => ({ ...prev, amountUsd: Number(event.target.value) }))}
                className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-600">Interest APR (%)</span>
              <input
                type="number"
                min={0}
                value={formState.interestApr}
                onChange={(event) => setFormState((prev) => ({ ...prev, interestApr: Number(event.target.value) }))}
                className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-600">Tenor (Months)</span>
              <input
                type="number"
                min={1}
                value={formState.termMonths}
                onChange={(event) => setFormState((prev) => ({ ...prev, termMonths: Number(event.target.value) }))}
                className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Repayment Cycle</span>
            <select
              value={formState.repaymentCycle}
              onChange={(event) => setFormState((prev) => ({ ...prev, repaymentCycle: event.target.value }))}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="WEEKLY">Weekly</option>
              <option value="BIWEEKLY">Bi-Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Scoring...' : 'Score Loan'}
          </button>
        </form>

        {mutation.isSuccess && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
            <p>
              Risk Score: <span className="font-semibold">{mutation.data.score.toFixed(2)}</span>
            </p>
            <p>Status: {mutation.data.loan.status}</p>
          </div>
        )}

        {mutation.isError && (
          <p className="text-sm text-red-500 mt-4">Unable to score loan: {(mutation.error as Error).message}</p>
        )}
      </section>
    </div>
  );
};

export default LoanDeskPage;
