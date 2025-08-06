// electron/main.ts

import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import knex from 'knex' // Importamos o Knex

// --- INÍCIO DA NOSSA LÓGICA DE BANCO DE DADOS ---

// 1. Configuração da conexão com o banco de dados
//    Usamos o nosso knexfile.js para obter as configurações corretas.
const knexConfig = require('../../knexfile.js')
const db = knex(knexConfig.development)

// 2. Definição dos "endpoints" de API para o banco de dados
//    Estes são os "ouvintes" que a nossa interface vai chamar.
function setupDatabaseIpc() {
  // Ouvinte para buscar todos os clientes
  ipcMain.handle('db:clients-get', async () => {
    try {
      const clients = await db('clients').select('*').orderBy('name', 'asc')
      return clients
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      return [] // Retorna um array vazio em caso de erro
    }
  })

  // Ouvinte para adicionar um novo cliente
  ipcMain.handle('db:client-add', async (_, clientData) => {
    try {
      // .returning('*') faz com que o banco de dados retorne o objeto completo inserido
      const [newClient] = await db('clients').insert(clientData).returning('*')
      return newClient
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error)
      return null // Retorna nulo em caso de erro
    }
  })
  
  // Ouvinte para deletar um cliente
  ipcMain.handle('db:client-delete', async (_, clientId) => {
    try {
      await db('clients').where('id', clientId).del()
      return { success: true, id: clientId }
    } catch (error) {
      console.error('Erro ao deletar cliente:', error)
      return { success: false, error: error.message }
    }
  })
}

// --- FIM DA NOSSA LÓGICA DE BANCO DE DADOS ---


// O resto do arquivo permanece praticamente o mesmo...

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

if (release().startsWith('6.1')) app.disableHardwareAcceleration()
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    width: 1200, // Aumentei a largura para acomodar melhor a interface
    height: 800, // E a altura
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true, // Mantenha true por segurança!
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { 
    win.loadURL(url)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  setupDatabaseIpc() // Chamamos nossa função de setup aqui!
  createWindow()
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})