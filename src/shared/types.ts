// Shared types used by both the main process and the renderer.

export interface Task {
  id: string
  text: string
  completed: boolean
}

export type DockSide = 'left' | 'right'

export interface AppSettings {
  dockSide: DockSide
  /** Vertical offset (px from the top of the work area) where the bookmark sits. */
  dockOffsetY: number
  /** Launch CherryTodo automatically when the user logs in. */
  launchAtStartup: boolean
}

export interface AppState {
  tasks: Task[]
  settings: AppSettings
  /** App version (from package.json) — shown on the settings screen. */
  version: string
}

/** Credit shown on the settings screen. */
export const CREDIT = {
  author: 'cacheton code',
  instagram: 'cacheton.code',
  instagramUrl: 'https://www.instagram.com/cacheton.code'
} as const

/** Collapsed side-tab window size (compact, square-ish — like a page index tab). */
export const COLLAPSED_SIZE = { width: 75, height: 100 } as const

/** Expanded task-list window size. */
export const EXPANDED_SIZE = { width: 320, height: 440 } as const

export const DEFAULT_SETTINGS: AppSettings = {
  dockSide: 'right',
  dockOffsetY: 120,
  launchAtStartup: false
}
