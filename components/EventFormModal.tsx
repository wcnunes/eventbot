
import React, { useState, useCallback } from 'react';
import { Event } from '../types';
import Button from './common/Button';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id_evento' | 'id_organizador' | 'ingressos_vendidos_pista' | 'ingressos_vendidos_vip'>) => Promise<void>;
  event?: Event;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
    <input
      className="w-full bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:ring-2 focus:ring-accent focus:outline-none"
      {...props}
    />
  </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
    <textarea
      className="w-full bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:ring-2 focus:ring-accent focus:outline-none"
      rows={4}
      {...props}
    ></textarea>
  </div>
);

const EventFormModal: React.FC<EventFormModalProps> = ({ isOpen, onClose, onSave, event }) => {
  const [formData, setFormData] = useState({
    nome_evento: event?.nome_evento || '',
    descricao: event?.descricao || '',
    data_inicio: event?.data_inicio ? new Date(event.data_inicio).toISOString().slice(0, 16) : '',
    data_fim: event?.data_fim ? new Date(event.data_fim).toISOString().slice(0, 16) : '',
    localizacao: event?.localizacao || '',
    preco_pista: event?.preco_pista || undefined,
    preco_vip: event?.preco_vip || undefined,
    total_ingressos_pista: event?.total_ingressos_pista || undefined,
    total_ingressos_vip: event?.total_ingressos_vip || undefined,
    capa_url: event?.capa_url || '',
    imagens_complementares: event?.imagens_complementares || ['', '', '', ''],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({
      ...prev,
      [name]: isNumber ? (value ? parseFloat(value) : undefined) : value,
    }));
  };

  // Função para lidar com upload de imagem (converte para base64)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => {
        if (field === 'capa_url') {
          return { ...prev, capa_url: reader.result as string };
        } else if (field === 'imagens_complementares' && typeof index === 'number') {
          const novasImagens = [...(prev.imagens_complementares || ['', '', '', ''])];
          novasImagens[index] = reader.result as string;
          return { ...prev, imagens_complementares: novasImagens };
        }
        return prev;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
        ...formData,
        data_inicio: new Date(formData.data_inicio).toISOString(),
        data_fim: new Date(formData.data_fim).toISOString(),
        capa_url: formData.capa_url,
        imagens_complementares: formData.imagens_complementares?.filter(Boolean),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-xl p-8 w-full max-w-3xl max-h-full overflow-y-auto border border-border-color shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-text-primary mb-6">{event ? 'Editar Evento' : 'Criar Novo Evento'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Nome do Evento" name="nome_evento" value={formData.nome_evento} onChange={handleChange} required />
          
          <TextAreaField label="Descrição" name="descricao" value={formData.descricao} onChange={handleChange} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Início do Evento" name="data_inicio" type="datetime-local" value={formData.data_inicio} onChange={handleChange} required />
            <InputField label="Término do Evento" name="data_fim" type="datetime-local" value={formData.data_fim} onChange={handleChange} required />
            <InputField label="Localização" name="localizacao" value={formData.localizacao} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Preço (Pista)" name="preco_pista" type="number" placeholder="ex: 50.00" min="0" step="0.01" value={formData.preco_pista || ''} onChange={handleChange} />
            <InputField label="Preço (VIP)" name="preco_vip" type="number" placeholder="ex: 150.00" min="0" step="0.01" value={formData.preco_vip || ''} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Total de Ingressos (Pista)" name="total_ingressos_pista" type="number" placeholder="ex: 200" min="0" value={formData.total_ingressos_pista || ''} onChange={handleChange} />
            <InputField label="Total de Ingressos (VIP)" name="total_ingressos_vip" type="number" placeholder="ex: 50" min="0" value={formData.total_ingressos_vip || ''} onChange={handleChange} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">Imagem de Capa <span className="text-red-500">*</span></label>
            <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'capa_url')} required={!formData.capa_url} />
            {formData.capa_url && (
              <img src={formData.capa_url} alt="Prévia da Capa" className="mt-2 rounded-lg max-h-32 border" />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">Imagens Complementares (até 4)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[0,1,2,3].map(idx => (
                <div key={idx} className="flex flex-col items-center">
                  <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'imagens_complementares', idx)} />
                  {formData.imagens_complementares && formData.imagens_complementares[idx] && (
                    <img src={formData.imagens_complementares[idx]} alt={`Complementar ${idx+1}`} className="mt-1 rounded-lg max-h-20 border" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar Evento</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;