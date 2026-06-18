import Store from 'electron-store'
import type { AppSettings, Task } from '../shared/types'
import { DEFAULT_SETTINGS } from '../shared/types'

interface StoreSchema {
  tasks: Task[]
  settings: AppSettings
}

/**
 * Persisted to `tasks.json` inside the app's userData folder.
 * (No database — plain local JSON, loaded automatically on startup.)
 */
const store = new Store<StoreSchema>({
  name: 'tasks',
  defaults: {
    tasks: [
      { id: 't1', text: 'Read Paper', completed: true },
      { id: 't2', text: 'Gym', completed: true },
      { id: 't3', text: 'Study', completed: false },
      { id: 't4', text: 'Laundry', completed: false },
      { id: 't5', text: 'Review Notes', completed: false }
    ],
    settings: DEFAULT_SETTINGS
  }
})

export const dataStore = {
  getTasks(): Task[] {
    return store.get('tasks')
  },
  setTasks(tasks: Task[]): void {
    store.set('tasks', tasks)
  },
  getSettings(): AppSettings {
    return { ...DEFAULT_SETTINGS, ...store.get('settings') }
  },
  setSettings(settings: AppSettings): void {
    store.set('settings', settings)
  },
  /** Absolute path of the JSON file on disk (handy for the README / debugging). */
  get path(): string {
    return store.path
  }
}
