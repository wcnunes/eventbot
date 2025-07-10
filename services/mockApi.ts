
import { Event, Payment, PaymentStatus } from '../types';

const today = new Date();
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

let mockEvents: Event[] = [
  {
    id_evento: 101,
    id_organizador: 1,
    nome_evento: 'Festa de Exemplo',
    descricao: 'Este é um evento modelo. Edite ou crie novos eventos para começar!',
    data_inicio: new Date().toISOString(),
    data_fim: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas depois
    localizacao: 'Local de Exemplo',
    capa_url: '',
    imagens_complementares: [],
    preco_pista: 50,
    preco_vip: 150,
    total_ingressos_pista: 100,
    total_ingressos_vip: 20,
    ingressos_vendidos_pista: 10,
    ingressos_vendidos_vip: 2,
  },
];

let mockPayments: Payment[] = [
  {
    id_pagamento: 1001,
    id_evento: 101,
    valor: 150,
    metodo_pagamento: 'PIX',
    status: PaymentStatus.Paid,
    data_pagamento: new Date().toISOString(),
  },
];


const simulateDelay = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), 500));
};

export const getEvents = (): Promise<Event[]> => simulateDelay(mockEvents);
export const getPayments = (): Promise<Payment[]> => simulateDelay(mockPayments);

export const createEvent = (eventData: Omit<Event, 'id_evento' | 'ingressos_vendidos_pista' | 'ingressos_vendidos_vip'>): Promise<Event> => {
    const newEvent: Event = {
        ...eventData,
        id_evento: Math.max(...mockEvents.map(e => e.id_evento), 0) + 1,
        ingressos_vendidos_pista: 0,
        ingressos_vendidos_vip: 0,
    };
    mockEvents = [newEvent, ...mockEvents];
    return simulateDelay(newEvent);
}

// Nova função para buscar status de pagamento via API real
export const getPaymentStatus = async (id_pagamento: number): Promise<string> => {
  try {
    const resp = await fetch(`http://localhost:3001/api/pagamentos/${id_pagamento}/status`);
    if (!resp.ok) throw new Error('Erro ao buscar status');
    const data = await resp.json();
    return data.status;
  } catch (e) {
    // Fallback: busca no mock local
    const pagamento = mockPayments.find(p => p.id_pagamento === id_pagamento);
    return pagamento ? pagamento.status : 'Desconhecido';
  }
};
