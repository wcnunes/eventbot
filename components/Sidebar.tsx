
import React from 'react';
import { View } from '../types';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const BotIcon: React.FC = () => (
  <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-xl">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.4 19.4C18.6 20.2 17.6 20.8 16.6 21.2M4.6 19.4c.8.8 1.8 1.4 2.8 1.8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12a3 3 0 100-6 3 3 0 000 6zM15 12a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  </div>
);

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
      isActive ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
    }`}
  >
    {icon}
    <span className="ml-4 font-semibold">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: View.Dashboard, label: 'Painel', icon: <DashboardIcon />, path: '/admin' },
    { id: View.Events, label: 'Eventos', icon: <EventsIcon />, path: '/admin' },
    { id: View.Payments, label: 'Pagamentos', icon: <PaymentsIcon />, path: '/admin' },
  ];

  return (
    <aside className="w-64 bg-primary border-r border-border-color p-6 flex-shrink-0 flex flex-col">
      <div className="flex items-center mb-10">
        <BotIcon />
        <h1 className="text-xl font-bold ml-3 text-text-primary">EventBot</h1>
      </div>
      <nav>
        <ul>
          {navItems.map(item => (
            <NavItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={currentView === item.id}
              onClick={() => {
                setView(item.id);
                navigate('/admin');
              }}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-center text-text-secondary text-xs">
        <p>&copy; {new Date().getFullYear()} EventBot</p>
        <p>Seu Gerente de Eventos</p>
      </div>
    </aside>
  );
};

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const EventsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const PaymentsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;

export default Sidebar;