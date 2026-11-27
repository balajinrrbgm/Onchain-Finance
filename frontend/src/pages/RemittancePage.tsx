import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../api/client';

export const RemittancePage = () => {
  const [formState, setFormState] = useState({
    senderId: '',
    receiverPhone: '',
    receiverAccountId: '',
    amount: 0,
    currency: 'USD',
    mobileMoneyProvider: 'M-Pesa'
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/remittances', {
        ...formState,
        amount: Number(formState.amount)
      });
      return data;
    }
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="max-w-xl space-y-6">
      <section className="bg-white rounded-xl shadow px-6 py-6">
        <h2 className="text-lg font-semibold text-slate-700">USSD-ready Stablecoin Rail</h2>
        <p className="text-sm text-slate-500 mb-4">
          Bridge diaspora liquidity directly to mobile wallets with Hedera-stable rails and telco partners.
        </p>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Sender ID</span>
            <input
              value={formState.senderId}
              onChange={(event) => setFormState((prev) => ({ ...prev, senderId: event.target.value }))}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Receiver Mobile</span>
            <input
              value={formState.receiverPhone}
              onChange={(event) => setFormState((prev) => ({ ...prev, receiverPhone: event.target.value }))}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+234..."
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Receiver Hedera Account (optional)</span>
            <input
              value={formState.receiverAccountId}
              onChange={(event) => setFormState((prev) => ({ ...prev, receiverAccountId: event.target.value }))}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.0.xxxx"
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-600">Amount</span>
              <input
                type="number"
                min={1}
                value={formState.amount}
                onChange={(event) => setFormState((prev) => ({ ...prev, amount: Number(event.target.value) }))}
                className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-600">Currency</span>
              <select
                value={formState.currency}
                onChange={(event) => setFormState((prev) => ({ ...prev, currency: event.target.value }))}
                className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="USD">USD</option>
                <option value="KES">KES</option>
                <option value="NGN">NGN</option>
                <option value="GHS">GHS</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Mobile Money Provider</span>
            <input
              value={formState.mobileMoneyProvider}
              onChange={(event) => setFormState((prev) => ({ ...prev, mobileMoneyProvider: event.target.value }))}
              className="rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="M-Pesa, MTN MoMo, Orange Money"
            />
          </label>
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Routing...' : 'Send Stable remittance'}
          </button>
        </form>
        {mutation.isSuccess && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
            <p>Remittance queued with reference {mutation.data.id}.</p>
            <p className="mt-1 text-xs text-emerald-600">Hedera Tx: {mutation.data.hedraTransactionId}</p>
          </div>
        )}
        {mutation.isError && (
          <p className="text-sm text-red-500 mt-4">Failed to send: {(mutation.error as Error).message}</p>
        )}
      </section>
    </div>
  );
};

export default RemittancePage;
