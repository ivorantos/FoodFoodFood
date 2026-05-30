import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, CalendarDays } from 'lucide-react';

const TopBar = () => {
  const { pathname } = useLocation();

  return (
      <header style={{
        background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px', height: 95, display: 'flex', alignItems: 'center',
        gap: 8, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
          <div style={{ width: 30, height: 30, background: '#FF9500', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UtensilsCrossed size={30} color="white" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>MealPlanner</span>
        </div>

        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

        <nav style={{ display: 'flex', gap: 2 }}>
          {[
            { to: '/recipes', label: 'Recetas', icon: <UtensilsCrossed size={32} /> },
            { to: '/planner', label: 'Planificador', icon: <CalendarDays size={32} /> },
          ].map(({ to, label, icon }) => {
            const active = pathname === to;
            return (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  background: active ? 'rgba(255,149,0,0.12)' : 'transparent',
                  color: active ? '#FF9500' : '#aaa',
                }}>
                  {icon}{label}
                </Link>
            );
          })}
        </nav>
      </header>
  );
};

export default TopBar;