
import React from 'react';
import { Payment, Event, PaymentStatus } from '../types';
import Card from './common/Card';
import { useEffect, useState } from 'react';
import { getPaymentStatus } from '../services/mockApi';

interface PaymentListProps {
  payments: Payment[];
  events: Event[];
}

const getStatusClass = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.Paid:
      return 'bg-green-500 text-white';
    case PaymentStatus.Pending:
      return 'bg-yellow-500 text-black';
    case PaymentStatus.Cancelled:
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const PaymentList: React.FC<PaymentListProps> = ({ payments, events }) => {
  const eventMap = new Map(events.map(e => [e.id_evento, e.nome_evento]));
  const [statusMap, setStatusMap] = useState<{ [id: number]: string }>({});
  const [loadingMap, setLoadingMap] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    payments.forEach(payment => {
      setLoadingMap(prev => ({ ...prev, [payment.id_pagamento]: true }));
      getPaymentStatus(payment.id_pagamento)
        .then(status => setStatusMap(prev => ({ ...prev, [payment.id_pagamento]: status })))
        .finally(() => setLoadingMap(prev => ({ ...prev, [payment.id_pagamento]: false })));
    });
  }, [payments]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Histórico de Pagamentos</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-color text-sm text-text-secondary uppercase">
                <th className="p-4">Data</th>
                <th className="p-4">Evento</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Método</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id_pagamento} className="border-b border-border-color last:border-b-0 hover:bg-primary transition-colors">
                  <td className="p-4">{new Date(payment.data_pagamento).toLocaleString('pt-BR')}</td>
                  <td className="p-4">{eventMap.get(payment.id_evento) || 'Evento Desconhecido'}</td>
                  <td className="p-4 font-semibold">{payment.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="p-4">{payment.metodo_pagamento}</td>
                  <td className="p-4 text-center">
                    {loadingMap[payment.id_pagamento] ? (
                      <span className="text-xs text-gray-400">Carregando...</span>
                    ) : (
                      <span className={getStatusClass(statusMap[payment.id_pagamento] as PaymentStatus || payment.status)}>
                        {statusMap[payment.id_pagamento] || payment.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="flex gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-green-500"></span> Pago
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-yellow-500"></span> Pendente
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-red-500"></span> Cancelado
        </div>
      </div>
    </div>
  );
};

export default PaymentList;