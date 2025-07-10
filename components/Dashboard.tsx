
import React from 'react';
import { Event, Payment, PaymentStatus } from '../types';
import Card from './common/Card';

interface DashboardProps {
  events: Event[];
  payments: Payment[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <Card className="flex flex-col items-center justify-between p-3 md:p-4 min-w-[160px] max-w-[200px] h-[140px] mx-auto">
    <div className="flex flex-col items-center w-full flex-1">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent bg-opacity-20 text-accent mb-2">
        {icon}
      </div>
      <p className="text-center text-xs md:text-sm text-text-secondary font-medium mt-1 mb-2 w-full truncate" style={{maxWidth: '90%'}}>{title}</p>
    </div>
    <div className="w-full flex items-center justify-center mt-2">
      <span className="font-bold text-text-primary" style={{fontSize: 'clamp(1rem, 2vw, 1.4rem)', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', width: '100%', textAlign: 'center'}}>{value}</span>
    </div>
  </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ events, payments }) => {
  const totalRevenue = payments
    .filter(p => p.status === PaymentStatus.Paid)
    .reduce((sum, p) => sum + p.valor, 0);

  // Quantidade de convites vendidos pagos
  const totalConvitesVendidos = payments.filter(p => p.status === PaymentStatus.Paid).length;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Painel</h1>
      <div className="flex flex-wrap gap-4 md:gap-6 w-full max-w-full justify-center">
        <StatCard title="Total de Eventos" value={events.length} icon={<EventsIcon />} />
        <StatCard title="Receita Total" value={totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} icon={<RevenueIcon />} />
        <StatCard title="Pagamentos Pendentes" value={payments.filter(p => p.status === PaymentStatus.Pending).length} icon={<PendingIcon />} />
        <StatCard title="Convites Vendidos (Pagos)" value={totalConvitesVendidos} icon={<TicketIcon />} />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Próximos Eventos</h2>
        <Card>
          {events.length > 0 ? (
            <ul>
              {events.slice(0, 5).map(event => (
                <li key={event.id_evento} className="flex justify-between items-center py-3 border-b border-border-color last:border-b-0">
                  <div>
                    <p className="font-semibold text-text-primary">{event.nome_evento}</p>
                    <p className="text-sm text-text-secondary">{new Date(event.data_hora).toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-accent">{event.localizacao}</p>
                    <p className="text-sm text-text-secondary">
                        {((event.ingressos_vendidos_pista || 0) + (event.ingressos_vendidos_vip || 0))} ingressos vendidos
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-secondary text-center py-4">Nenhum próximo evento encontrado.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

const EventsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const PendingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TicketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="3" y="7" width="18" height="10" rx="2" />
    <path d="M7 7v10M17 7v10" />
  </svg>
);

export default Dashboard;