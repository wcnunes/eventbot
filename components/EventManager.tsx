
import React, { useState } from 'react';
import { Event } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import EventFormModal from './EventFormModal';

interface EventManagerProps {
  events: Event[];
  onCreateEvent: (event: Omit<Event, 'id_evento' | 'id_organizador' | 'ingressos_vendidos_pista' | 'ingressos_vendidos_vip'>) => Promise<void>;
  onUpdateEvent: (event: Event) => void;
}

const EventCard: React.FC<{ event: Event; onEdit: (event: Event) => void }> = ({ event, onEdit }) => {
  const sold = (event.ingressos_vendidos_pista || 0) + (event.ingressos_vendidos_vip || 0);
  const total = (event.total_ingressos_pista || 0) + (event.total_ingressos_vip || 0);
  const progress = total > 0 ? (sold / total) * 100 : 0;

  // Formatação de datas
  const inicio = new Date(event.data_inicio);
  const fim = new Date(event.data_fim);
  const isValidDate = (d: Date) => !isNaN(d.getTime());
  const intervalo = (isValidDate(inicio) && isValidDate(fim))
    ? (inicio.toLocaleDateString('pt-BR') === fim.toLocaleDateString('pt-BR')
        ? `${inicio.toLocaleDateString('pt-BR')} das ${inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} às ${fim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
        : `${inicio.toLocaleDateString('pt-BR')} ${inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} até ${fim.toLocaleDateString('pt-BR')} ${fim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
      )
    : 'Data inválida';

  // Template dinâmico para mensagem de convite do evento
  const shareMessage = `🎉 CONVITE ESPECIAL 🎉\n📣 Olá, amigos!\n\nVenha participar do evento: *${event.nome_evento}*\n\n${event.descricao}\n\n📆 Data: ${intervalo}\n📍 Local: ${event.localizacao}\n\nContamos com sua presença!`;
  const urlEncodedMsg = encodeURIComponent(shareMessage);

  // Funções de compartilhamento
  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${urlEncodedMsg}`, '_blank');
  };
  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=&quote=${urlEncodedMsg}`, '_blank');
  };
  const handleShareX = () => {
    window.open(`https://x.com/intent/tweet?text=${urlEncodedMsg}`, '_blank');
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage);
    alert('Texto do evento copiado!');
  };

  return (
    <Card className="flex flex-col justify-between min-h-[460px]">
      {event.capa_url && (
        <img src={event.capa_url} alt="Capa do Evento" className="w-full aspect-[16/9] object-cover rounded-t-lg mb-2" />
      )}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-text-primary">{event.nome_evento}</h3>
            <span className="text-xs font-semibold bg-accent text-white px-2 py-1 rounded-full">{event.localizacao}</span>
        </div>
        <p className="text-sm text-text-secondary">{intervalo}</p>
        <p className="text-text-secondary text-sm mb-4 line-clamp-3 h-16 overflow-hidden">{event.descricao}</p>
      </div>
      <div>
        <div className="flex justify-between items-center text-sm text-text-secondary mb-1">
            <span>Ingressos Vendidos</span>
            <span>{sold} / {total > 0 ? total : '∞'}</span>
        </div>
        <div className="w-full bg-primary rounded-full h-2.5 mb-2">
          <div className="bg-accent h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex flex-wrap gap-2 justify-between items-center mt-4">
          <Button type="button" className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm" onClick={() => onEdit(event)}>
            Editar
          </Button>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button type="button" className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm" onClick={handleShareWhatsApp} style={{ minWidth: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" fill="currentColor"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.37L4 29l7.824-2.05A12.94 12.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.77 0-3.468-.46-4.94-1.32l-.35-.2-4.65 1.22 1.24-4.52-.23-.36A9.94 9.94 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.29-7.71c-.29-.15-1.71-.84-1.97-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3.01.15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z"/></svg>
              WhatsApp
            </Button>
            <Button type="button" className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm" onClick={handleShareFacebook} style={{ minWidth: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" fill="currentColor"><path d="M29 0H3C1.343 0 0 1.343 0 3v26c0 1.657 1.343 3 3 3h13V20h-4v-5h4v-3.5C16 8.57 18.014 7 20.5 7c1.104 0 2 .896 2 2v3h3v5h-3v12h5c1.657 0 3-1.343 3-3V3c0-1.657-1.343-3-3-3z"/></svg>
              Facebook
          </Button>
            <Button type="button" className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white px-3 py-1 text-sm" onClick={handleShareX} style={{ minWidth: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" width="18" height="18" fill="currentColor"><path d="M807 0h374L727 522l473 705H872l-295-434-337 434H0l469-604L13 0h374l263 387zm-51 770l114 168h125l-180-267-59 99zm-486 282h125l163-210-73-108-215 318zm-8-900l184 273 80-120L340 152H262zm324 480l-99-148-70 108 69 104 100-64zm-41-62l41 62 41-62-41-62-41 62zm-41-62l-80-120-184 273h125l139-153zm-263-387l215 318 73-108L340 152H262zm324 480l-99-148-70 108 69 104 100-64zm-41-62l41 62 41-62-41-62-41 62zm-41-62l-80-120-184 273h125l139-153z"/></svg>
              X
          </Button>
            <Button type="button" className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 text-sm" onClick={handleCopyLink} style={{ minWidth: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/><rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2"/></svg>
              Copiar
          </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

const EventManager: React.FC<EventManagerProps> = ({ events, onCreateEvent, onUpdateEvent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Função para salvar (criar ou editar)
  const handleSave = async (eventData: Omit<Event, 'id_evento' | 'id_organizador' | 'ingressos_vendidos_pista' | 'ingressos_vendidos_vip'>) => {
    if (editingEvent) {
      onUpdateEvent({
        ...editingEvent,
        ...eventData,
        id_evento: editingEvent.id_evento,
        id_organizador: editingEvent.id_organizador,
      });
      setEditingEvent(null);
    } else {
      await onCreateEvent(eventData);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Gerenciamento de Eventos</h1>
        <Button onClick={() => { setIsModalOpen(true); setEditingEvent(null); }}>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Criar Evento
          </span>
        </Button>
      </div>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {events.map(event => <EventCard key={event.id_evento} event={event} onEdit={setEditingEvent} />)}
        </div>
      ) : (
        <Card className="text-center py-10">
          <p className="text-text-secondary">Nenhum evento encontrado. Crie seu primeiro evento para começar!</p>
        </Card>
      )}
      {(isModalOpen || editingEvent) && (
        <EventFormModal 
          isOpen={isModalOpen || !!editingEvent}
          onClose={() => { setIsModalOpen(false); setEditingEvent(null); }}
          onSave={handleSave}
          event={editingEvent || undefined}
        />
      )}
    </div>
  );
};

export default EventManager;