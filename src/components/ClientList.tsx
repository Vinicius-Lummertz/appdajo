// src/components/ClientList.tsx

interface ClientListProps {
  clients: any[]; // A lista de clientes
  onClientDeleted: (deletedClientId: number) => void; // Função para avisar sobre deleção
}

export function ClientList({ clients, onClientDeleted }: ClientListProps) {

  const handleDelete = async (clientId: number) => {
    // Confirmação para evitar deleções acidentais
    const isConfirmed = window.confirm('Tem certeza que deseja deletar este cliente? Esta ação não pode ser desfeita.');
    if (isConfirmed) {
      const result = await window.db_api.deleteClient(clientId);
      if (result.success) {
        onClientDeleted(result.id);
      } else {
        alert('Ocorreu um erro ao deletar o cliente.');
      }
    }
  };

  return (
    <div className="space-y-4 rounded-lg bg-gray-800 p-6">
      <h2 className="text-xl font-bold text-white">Clientes Cadastrados</h2>
      {clients.length === 0 ? (
        <p className="text-center text-gray-400">Nenhum cliente cadastrado ainda.</p>
      ) : (
        <ul className="divide-y divide-gray-700">
          {clients.map((client) => (
            <li key={client.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-white">{client.name}</p>
                <p className="text-sm text-gray-400">{client.phone || 'Sem telefone'}</p>
              </div>
              <button onClick={() => handleDelete(client.id)} className="rounded bg-red-800/50 px-2 py-1 text-xs font-semibold text-red-300 hover:bg-red-800">
                Deletar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}