
export interface Event {
  id_evento: number;
  id_organizador: number;
  nome_evento: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  localizacao: string;
  capa_url: string; // URL da imagem de capa
  imagens_complementares?: string[]; // URLs das imagens complementares (até 4)
  preco_pista?: number;
  preco_vip?: number;
  total_ingressos_pista?: number;
  total_ingressos_vip?: number;
  ingressos_vendidos_pista?: number;
  ingressos_vendidos_vip?: number;
}

export enum PaymentStatus {
  Paid = 'Pago',
  Pending = 'Pendente',
  Cancelled = 'Cancelado'
}

export interface Payment {
  id_pagamento: number;
  id_evento: number;
  valor: number;
  metodo_pagamento: string;
  status: PaymentStatus;
  data_pagamento: string;
}

export enum View {
  Dashboard = 'Dashboard',
  Events = 'Events',
  Payments = 'Payments',
}