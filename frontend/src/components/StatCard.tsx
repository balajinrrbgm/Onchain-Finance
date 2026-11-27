interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export const StatCard = ({ title, value, subtitle }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow px-6 py-5">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-2xl font-semibold text-primary mt-1">{value}</p>
    {subtitle ? <p className="text-xs text-slate-400 mt-2">{subtitle}</p> : null}
  </div>
);
