"use strict";
const electron = require("electron");
const dbApi = {
  // Cada função aqui corresponde a um "ouvinte" que criamos no main.ts
  getClients: () => electron.ipcRenderer.invoke("db:clients-get"),
  addClient: (clientData) => electron.ipcRenderer.invoke("db:client-add", clientData),
  deleteClient: (clientId) => electron.ipcRenderer.invoke("db:client-delete", clientId)
  // Adicionaremos updateClient e outras funções aqui no futuro.
};
electron.contextBridge.exposeInMainWorld("db_api", dbApi);
