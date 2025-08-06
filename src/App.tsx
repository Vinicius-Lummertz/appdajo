// src/App.tsx

import { useState, useEffect } from 'react';
import { ClientForm } from './components/ClientForm';
import { ClientList } from './components/ClientList';

function App() {
  const [clients, setClients] = useState<any[]>([]);

  // useEffect para buscar os dados iniciais quando o componente é montado
  useEffect(() => {
    const fetchClients = async () => {
      const fetchedClients = await window.db_api.getClients();
      setClients(fetchedClients);
    };
    fetchClients();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // Função para atualizar o estado quando um novo cliente é adicionado
  const handleClientAdded = (newClient: any) => {
    setClients((prevClients) => [...prevClients, newClient].sort((a, b) => a.name.localeCompare(b.name)));
  };

  // Função para atualizar o estado quando um cliente é deletado
  const handleClientDeleted = (deletedClientId: number) => {
    setClients((prevClients) => prevClients.filter(client => client.id !== deletedClientId));
  };

  return (
    <main className="min-h-screen w-full bg-gray-900 p-8 text-white">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-emerald-400">Saloon Manager</h1>
        <p className="text-gray-400">Módulo de Gestão de Clientes</p>
      </header>
      
      {/* Layout de duas colunas */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        
        {/* Coluna do Formulário */}
        <div className="md:col-span-1">
          <ClientForm onClientAdded={handleClientAdded} />
        </div>
        
        {/* Coluna da Lista */}
        <div className="md:col-span-2">
          <ClientList clients={clients} onClientDeleted={handleClientDeleted} />
        </div>

      </div>
    </main>
  );
}

export default App;