// electron/preload.ts

import { contextBridge, ipcRenderer } from 'electron'

// A "API" que estamos expondo para o processo de renderização (nossa interface React)
const dbApi = {
  // Cada função aqui corresponde a um "ouvinte" que criamos no main.ts
  getClients: () => ipcRenderer.invoke('db:clients-get'),
  
  addClient: (clientData) => ipcRenderer.invoke('db:client-add', clientData),
  
  deleteClient: (clientId) => ipcRenderer.invoke('db:client-delete', clientId),
  
  // Adicionaremos updateClient e outras funções aqui no futuro.
}

// O 'contextBridge' expõe nossa API de forma segura para a interface.
// A interface poderá acessar essas funções através de 'window.db_api'.
contextBridge.exposeInMainWorld('db_api', dbApi)

// Para mantermos a segurança e o bom funcionamento, precisamos definir os tipos
// da nossa API para o TypeScript.
export type DbApi = typeof dbApi