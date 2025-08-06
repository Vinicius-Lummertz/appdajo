// src/components/ClientForm.tsx

import { useState } from 'react';

// Definimos as propriedades que este componente receberá (uma função)
interface ClientFormProps {
  onClientAdded: (newClient: any) => void;
}

export function ClientForm({ onClientAdded }: ClientFormProps) {
  // Estados para cada campo do formulário
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Feminino');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Impede o recarregamento da página

    const clientData = { name, phone, email, gender };

    // Usamos nossa API do preload para chamar a função do processo principal
    const newClient = await window.db_api.addClient(clientData);

    if (newClient) {
      onClientAdded(newClient); // Avisa o componente pai sobre o novo cliente
      // Limpa os campos do formulário
      setName('');
      setPhone('');
      setEmail('');
      setGender('Feminino');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-gray-800 p-6">
      <h2 className="text-xl font-bold text-white">Cadastrar Cliente</h2>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-300">Nome</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-300">Telefone</label>
        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-300">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
      </div>
      <div>
        <label htmlFor="gender" className="mb-1 block text-sm font-medium text-gray-300">Sexo</label>
        <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
          <option>Feminino</option>
          <option>Masculino</option>
          <option>Outro</option>
        </select>
      </div>
      <button type="submit" className="w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-800">
        Salvar Cliente
      </button>
    </form>
  );
}