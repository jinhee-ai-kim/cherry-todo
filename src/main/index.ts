import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { dataStore } from './store'
import {
  COLLAPSED_SIZE,
  EXPANDED_SIZE,
  type AppSettings,
  type AppState,
  type DockSide,
  type Task
} from '../shared/types'

let mainWindow: BrowserWindow | null = null
let isExpanded = false

/** Work area of the display the window currently lives on. */
function currentWorkArea(): Electron.Rectangle {
  const bounds = mainWindow?.getBounds() ?? { x: 0, y: 0, width: 0, height: 0 }
  return screen.getDisplayMatching(bounds).workArea
}

/** Compute the docked X coordinate for a given width + side. */
function dockedX(side: DockSide, width: number, work: Electron.Rectangle): number {
  return side === 'left' ? work.x : work.x + work.width - width
}

/** Clamp Y so the window stays fully inside the work area. */
function clampY(y: number, height: number, work: Electron.Rectangle): number {
  const max = work.y + work.height - height
  return Math.max(work.y, Math.min(y, max))
}

/** Snap the window flush against its docked edge at the stored vertical offset. */
function applyDock(expanded: boolean): void {
  if (!mainWindow) return
  const { dockSide, dockOffsetY } = dataStore.getSettings()
  const work = currentWorkArea()
  const size = expanded ? EXPANDED_SIZE : COLLAPSED_SIZE
  const x = dockedX(dockSide, size.width, work)
  const y = clampY(work.y + dockOffsetY, size.height, work)
  mainWindow.setBounds({ x, y, width: size.width, height: size.height }, false)
}

function createWindow(): void {
  const settings = dataStore.getSettings()
  const work = screen.getPrimaryDisplay().workArea
  const x = dockedX(settings.dockSide, COLLAPSED_SIZE.width, work)
  const y = clampY(work.y + settings.dockOffsetY, COLLAPSED_SIZE.height, work)

  mainWindow = new BrowserWindow({
    width: COLLAPSED_SIZE.width,
    height: COLLAPSED_SIZE.height,
    x,
    y,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    hasShadow: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  // Keep it pinned above everything, including fullscreen apps.
  mainWindow.setAlwaysOnTop(true, 'screen-saver')
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  mainWindow.on('ready-to-show', () => mainWindow?.show())

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (devUrl) {
    mainWindow.loadURL(devUrl)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function buildState(): AppState {
  return {
    tasks: dataStore.getTasks(),
    settings: dataStore.getSettings(),
    version: app.getVersion()
  }
}

/** Register/unregister the OS "launch at login" entry (only meaningful when packaged). */
function applyLaunchAtStartup(enabled: boolean): void {
  if (!app.isPackaged) return
  app.setLoginItemSettings({ openAtLogin: enabled })
}

function registerIpc(): void {
  ipcMain.handle('state:get', (): AppState => buildState())

  ipcMain.handle('tasks:set', (_e, tasks: Task[]): void => {
    dataStore.setTasks(tasks)
  })

  ipcMain.handle('settings:set', (_e, settings: AppSettings): void => {
    dataStore.setSettings(settings)
    applyDock(isExpanded)
  })

  // Expand / collapse: resize + reposition flush against the docked edge.
  ipcMain.handle('window:setExpanded', (_e, expanded: boolean): void => {
    isExpanded = expanded
    applyDock(expanded)
  })

  // Switch the docked edge (from the settings UI).
  ipcMain.handle('window:setDock', (_e, side: DockSide): void => {
    const settings = dataStore.getSettings()
    dataStore.setSettings({ ...settings, dockSide: side })
    applyDock(isExpanded)
  })

  // --- Free dragging of the collapsed bookmark along the screen edge ---
  ipcMain.handle('window:getBounds', (): Electron.Rectangle => {
    return mainWindow?.getBounds() ?? { x: 0, y: 0, width: 0, height: 0 }
  })

  ipcMain.handle('window:moveTo', (_e, x: number, y: number): void => {
    if (!mainWindow) return
    const work = currentWorkArea()
    const [w, h] = mainWindow.getSize()
    // Allow horizontal travel (to switch sides) but keep it on-screen vertically.
    mainWindow.setBounds({ x: Math.round(x), y: clampY(Math.round(y), h, work), width: w, height: h }, false)
  })

  // On drag end: snap to the nearest edge and persist the new side + offset.
  ipcMain.handle('window:snapDock', (): AppSettings => {
    if (!mainWindow) return dataStore.getSettings()
    const b = mainWindow.getBounds()
    const work = currentWorkArea()
    const centerX = b.x + b.width / 2
    const side: DockSide = centerX < work.x + work.width / 2 ? 'left' : 'right'
    const offsetY = Math.round(clampY(b.y, b.height, work) - work.y)
    const next: AppSettings = { ...dataStore.getSettings(), dockSide: side, dockOffsetY: offsetY }
    dataStore.setSettings(next)
    applyDock(isExpanded)
    return next
  })

  // Toggle "launch when the computer starts" and persist the preference.
  ipcMain.handle('app:setLaunchAtStartup', (_e, enabled: boolean): void => {
    const settings = dataStore.getSettings()
    dataStore.setSettings({ ...settings, launchAtStartup: enabled })
    applyLaunchAtStartup(enabled)
  })

  // Open a link (e.g. the Instagram credit) in the user's default browser.
  ipcMain.handle('app:openExternal', (_e, url: string): void => {
    shell.openExternal(url)
  })

  ipcMain.handle('app:quit', (): void => app.quit())
}

// Allow only a single running copy. If a second instance is launched, it quits
// immediately and the already-running one surfaces its window instead.
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.show()
    mainWindow.focus()
  })

  app.whenReady().then(() => {
    registerIpc()
    // Keep the OS login item in sync with the saved preference.
    applyLaunchAtStartup(dataStore.getSettings().launchAtStartup)
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}

// Keep running in the tray-less, always-on-top style; quit only when asked.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
