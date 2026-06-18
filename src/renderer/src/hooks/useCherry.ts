import { useCallback, useEffect, useState } from 'react'
import type { AppSettings, DockSide, Task } from '../types'
import { DEFAULT_SETTINGS } from '../../../shared/types'

const uid = (): string =>
  `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export interface CherryController {
  ready: boolean
  tasks: Task[]
  settings: AppSettings
  version: string
  completed: number
  total: number
  allDone: boolean
  addTask: (text: string) => void
  editTask: (id: string, text: string) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  reorderTasks: (tasks: Task[]) => void
  setDock: (side: DockSide) => void
  setLaunchAtStartup: (enabled: boolean) => void
  /** Apply settings that the main process already persisted (e.g. after a drag-snap). */
  syncSettings: (settings: AppSettings) => void
}

/** Loads persisted state once, then writes through to the main process on change. */
export function useCherry(): CherryController {
  const [ready, setReady] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [version, setVersion] = useState('')

  useEffect(() => {
    let mounted = true
    window.cherry.getState().then((state) => {
      if (!mounted) return
      setTasks(state.tasks)
      setSettings(state.settings)
      setVersion(state.version)
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  // Persist tasks after the initial load.
  useEffect(() => {
    if (ready) window.cherry.setTasks(tasks)
  }, [tasks, ready])

  const addTask = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks((prev) => [...prev, { id: uid(), text: trimmed, completed: false }])
  }, [])

  const editTask = useCallback((id: string, text: string) => {
    const trimmed = text.trim()
    setTasks((prev) =>
      prev.flatMap((t) =>
        t.id === id ? (trimmed ? [{ ...t, text: trimmed }] : []) : [t]
      )
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === id)
      if (!target) return prev
      const updated = { ...target, completed: !target.completed }
      const rest = prev.filter((t) => t.id !== id)
      if (updated.completed) {
        // Just completed → sink to the very bottom of the list.
        return [...rest, updated]
      }
      // Un-completed → lift it back above the completed group (bottom of active items).
      const firstCompleted = rest.findIndex((t) => t.completed)
      return firstCompleted === -1
        ? [...rest, updated]
        : [...rest.slice(0, firstCompleted), updated, ...rest.slice(firstCompleted)]
    })
  }, [])

  const reorderTasks = useCallback((next: Task[]) => setTasks(next), [])

  const setDock = useCallback((side: DockSide) => {
    setSettings((prev) => ({ ...prev, dockSide: side }))
    window.cherry.setDock(side)
  }, [])

  const setLaunchAtStartup = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, launchAtStartup: enabled }))
    window.cherry.setLaunchAtStartup(enabled)
  }, [])

  const syncSettings = useCallback((next: AppSettings) => setSettings(next), [])

  const completed = tasks.filter((t) => t.completed).length
  const total = tasks.length
  const allDone = total > 0 && completed === total

  return {
    ready,
    tasks,
    settings,
    version,
    completed,
    total,
    allDone,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
    reorderTasks,
    setDock,
    setLaunchAtStartup,
    syncSettings
  }
}
