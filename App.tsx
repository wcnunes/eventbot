
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { View, Event, Payment } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EventManager from './components/EventManager';
import PaymentList from './components/PaymentList';
import { getEvents, getPayments, createEvent as apiCreateEvent } from './services/mockApi';

// Componente de Cadastro de Admin
const AdminRegister: React.FC<{ onRegister: () => void }> = ({ onRegister }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !senha || !pergunta || !resposta) {
      setErro('Preencha todos os campos.');
      return;
    }
    localStorage.setItem('admin_login', login);
    localStorage.setItem('admin_senha', senha);
    localStorage.setItem('admin_pergunta', pergunta);
    localStorage.setItem('admin_resposta', resposta);
    onRegister();
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-text-primary">Cadastro do Administrador</h2>
        <input className="w-full mb-3 p-2 rounded" placeholder="Login" value={login} onChange={e => setLogin(e.target.value)} />
        <input className="w-full mb-3 p-2 rounded" placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />
        <input className="w-full mb-3 p-2 rounded" placeholder="Pergunta secreta (ex: Nome do seu primeiro animal?)" value={pergunta} onChange={e => setPergunta(e.target.value)} />
        <input className="w-full mb-3 p-2 rounded" placeholder="Resposta secreta" value={resposta} onChange={e => setResposta(e.target.value)} />
        {erro && <div className="text-red-500 mb-2">{erro}</div>}
        <button type="submit" className="w-full bg-accent text-white py-2 rounded">Cadastrar</button>
      </form>
    </div>
  );
};

// Modal simples para recuperação de senha
const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-secondary p-6 rounded-xl shadow-lg min-w-[320px] relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-text-secondary hover:text-text-primary text-xl">×</button>
        {children}
      </div>
    </div>
  );
};

// Componente de Login do Admin
const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showRecuperar, setShowRecuperar] = useState(false);
  const [respostaRecuperar, setRespostaRecuperar] = useState('');
  const [recuperarErro, setRecuperarErro] = useState('');
  const [senhaRecuperada, setSenhaRecuperada] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminLogin = localStorage.getItem('admin_login');
    const adminSenha = localStorage.getItem('admin_senha');
    if (login === adminLogin && senha === adminSenha) {
      localStorage.setItem('admin_autenticado', 'true');
      onLogin();
    } else {
      setErro('Login ou senha incorretos.');
    }
  };

  const handleRecuperar = (e: React.FormEvent) => {
    e.preventDefault();
    const respostaSalva = localStorage.getItem('admin_resposta') || '';
    if (respostaRecuperar.trim().toLowerCase() === respostaSalva.trim().toLowerCase()) {
      setSenhaRecuperada(localStorage.getItem('admin_senha') || '');
      setRecuperarErro('');
    } else {
      setSenhaRecuperada(null);
      setRecuperarErro('Resposta incorreta.');
    }
  };

  const perguntaSecreta = localStorage.getItem('admin_pergunta') || '';

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-text-primary">Login do Administrador</h2>
        <input className="w-full mb-3 p-2 rounded" placeholder="Login" value={login} onChange={e => setLogin(e.target.value)} />
        <input className="w-full mb-3 p-2 rounded" placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />
        {erro && <div className="text-red-500 mb-2">{erro}</div>}
        <button type="submit" className="w-full bg-accent text-white py-2 rounded mb-2">Entrar</button>
        <button type="button" className="w-full bg-gray-500 text-white py-2 rounded" onClick={() => {
          setShowRecuperar(true);
          setRespostaRecuperar('');
          setRecuperarErro('');
          setSenhaRecuperada(null);
        }}>
          Esqueci a senha
        </button>
      </form>
      <Modal open={showRecuperar} onClose={() => setShowRecuperar(false)}>
        <h3 className="text-lg font-bold mb-2 text-text-primary">Recuperação de Senha</h3>
        <div className="mb-2 text-text-primary">{perguntaSecreta}</div>
        <form onSubmit={handleRecuperar}>
          <input className="w-full mb-2 p-2 rounded" placeholder="Resposta secreta" value={respostaRecuperar} onChange={e => setRespostaRecuperar(e.target.value)} />
          <button type="submit" className="w-full bg-accent text-white py-2 rounded">Recuperar senha</button>
        </form>
        {recuperarErro && <div className="text-red-500 mt-2">{recuperarErro}</div>}
        {senhaRecuperada && <div className="text-green-500 mt-2">Sua senha: <b>{senhaRecuperada}</b></div>}
      </Modal>
    </div>
  );
};

// Componente de Logout
const AdminLogout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <button
    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
    onClick={() => {
      localStorage.removeItem('admin_autenticado');
      onLogout();
    }}
  >
    Sair
  </button>
);

// Novo componente Mural (apenas lista de eventos, sem dashboard ou pagamentos)
const Mural: React.FC<{ events: Event[] }> = ({ events }) => {
  // Função utilitária para gerar texto do evento
  const getShareText = (event: Event) => {
    return `Evento: ${event.nome_evento}\nData: ${new Date(event.data_inicio).toLocaleString('pt-BR')}\nLocal: ${event.localizacao}`;
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Mural de Eventos</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const shareText = encodeURIComponent(getShareText(event));
          const url = window.location.origin + '/mural';
          return (
            <li key={event.id_evento} className="bg-secondary p-4 rounded-xl border border-border-color shadow-lg">
              <p className="font-semibold text-text-primary">{event.nome_evento}</p>
              <p className="text-sm text-text-secondary">{new Date(event.data_inicio).toLocaleString('pt-BR')} - {new Date(event.data_fim).toLocaleString('pt-BR')}</p>
              <p className="text-sm text-text-secondary">{event.localizacao}</p>
              <p className="text-sm text-text-secondary mt-2">{event.descricao}</p>
              <div className="flex gap-2 mt-4">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Compartilhar no WhatsApp"
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  WhatsApp
                </a>
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Compartilhar no Facebook"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Facebook
                </a>
                {/* Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Compartilhar no Twitter"
                  className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded"
                >
                  Twitter
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<View>(View.Dashboard); // Só usado em /admin
  const [autenticado, setAutenticado] = useState(localStorage.getItem('admin_autenticado') === 'true');
  const [temAdmin, setTemAdmin] = useState(!!localStorage.getItem('admin_login'));

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

  // Funções de autenticação
  const handleLogin = () => setAutenticado(true);
  const handleLogout = () => setAutenticado(false);
  const handleRegister = () => {
    setTemAdmin(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent"></div></div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rota do mural (consulta/compartilhamento) */}
        <Route path="/mural" element={
          <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <Mural events={events} />
          </main>
        } />
        {/* Rota do admin (painel completo, protegido) */}
        <Route path="/admin" element={
          !temAdmin ? (
            <AdminRegister onRegister={handleRegister} />
          ) : !autenticado ? (
            <AdminLogin onLogin={handleLogin} />
          ) : (
            <div className="flex h-screen font-sans text-text-primary bg-primary relative">
              <Sidebar currentView={view} setView={setView} />
              <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <AdminLogout onLogout={handleLogout} />
                {(() => {
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
                })()}
              </main>
            </div>
          )
        } />
        {/* Redirecionamento padrão para o mural */}
        <Route path="*" element={<Navigate to="/mural" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
