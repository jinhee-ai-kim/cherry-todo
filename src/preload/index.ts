import { contextBridge, ipcRenderer } from 'electron'
import type { AppSettings, AppState, DockSide, Task } from '../shared/types'

interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

const api = {
  getState: (): Promise<AppState> => ipcRenderer.invoke('state:get'),
  setTasks: (tasks: Task[]): Promise<void> => ipcRenderer.invoke('tasks:set', tasks),
  setSettings: (settings: AppSettings): Promise<void> =>
    ipcRenderer.invoke('settings:set', settings),

  setExpanded: (expanded: boolean): Promise<void> =>
    ipcRenderer.invoke('window:setExpanded', expanded),
  setDock: (side: DockSide): Promise<void> => ipcRenderer.invoke('window:setDock', side),

  getBounds: (): Promise<Bounds> => ipcRenderer.invoke('window:getBounds'),
  moveTo: (x: number, y: number): Promise<void> => ipcRenderer.invoke('window:moveTo', x, y),
  snapDock: (): Promise<AppSettings> => ipcRenderer.invoke('window:snapDock'),

  setLaunchAtStartup: (enabled: boolean): Promise<void> =>
    ipcRenderer.invoke('app:setLaunchAtStartup', enabled),
  openExternal: (url: string): Promise<void> => ipcRenderer.invoke('app:openExternal', url),

  quit: (): Promise<void> => ipcRenderer.invoke('app:quit')
}

export type CherryApi = typeof api

contextBridge.exposeInMainWorld('cherry', api)
