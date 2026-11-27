import { NavLink } from 'react-router-dom';
import type { PropsWithChildren } from 'react';

const navLinkBase = 'px-4 py-2 rounded-md font-medium transition-colors';

const activeClass = ({ isActive }: { isActive: boolean }) =>
  `${navLinkBase} ${isActive ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'}`;

export const Layout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-white shadow">
      <div className="mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">AfriAsset</h1>
        <nav className="flex gap-2">
          <NavLink to="/dashboard" className={activeClass}>
            Dashboard
          </NavLink>
          <NavLink to="/assets" className={activeClass}>
            Asset Onboarding
          </NavLink>
          <NavLink to="/loans" className={activeClass}>
            Loan Desk
          </NavLink>
          <NavLink to="/remittance" className={activeClass}>
            Remittance
          </NavLink>
        </nav>
      </div>
    </header>
    <main className="flex-1 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </main>
  </div>
);
