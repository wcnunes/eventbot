
import React, { useState, useEffect, useCallback } from 'react';
import { View, Event, Payment } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EventManager from './components/EventManager';
import PaymentList from './components/PaymentList';
import { getEvents, getPayments, createEvent as apiCreateEvent } from './services/mockApi';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [events, setEvents] = useState<Event[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [eventsData, paymentsData] = await Promise.all([
        getEvents(),
        getPayments(),
      ]);
      setEvents(eventsData);
      setPayments(paymentsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateEvent = async (event: Omit<Event, 'id_evento' | 'id_organizador' | 'ingressos_vendidos_pista' | 'ingressos_vendidos_vip'>) => {
    const newEvent = await apiCreateEvent({
        ...event,
        id_organizador: 1, // Mock organizer ID
    });
    setEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prevEvents => prevEvents.map(ev => ev.id_evento === updatedEvent.id_evento ? { ...ev, ...updatedEvent } : ev));
  };

  const renderView = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent"></div></div>;
    }
    switch (view) {
      case View.Dashboard:
        return <Dashboard events={events} payments={payments} />;
      case View.Events:
        return <EventManager events={events} onCreateEvent={handleCreateEvent} onUpdateEvent={handleUpdateEvent} />;
      case View.Payments:
        return <PaymentList payments={payments} events={events} />;
      default:
        return <Dashboard events={events} payments={payments} />;
    }
  };

  return (
    <div className="flex h-screen font-sans text-text-primary bg-primary">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
