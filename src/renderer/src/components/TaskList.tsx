import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Reorder } from 'framer-motion'
import type { AppSettings, DockSide, Task } from '../types'
import { TaskItem } from './TaskItem'
import { AllDone } from './AllDone'
import { Settings } from './Settings'
import { useEdgeDrag } from '../hooks/useEdgeDrag'
import cherryPair from '../assets/cherry-pair.svg'

interface TaskListProps {
  tasks: Task[]
  completed: number
  total: number
  allDone: boolean
  dockSide: DockSide
  version: string
  launchAtStartup: boolean
  onToggle: (id: string) => void
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
  onAdd: (text: string) => void
  onReorder: (tasks: Task[]) => void
  onSetDock: (side: DockSide) => void
  onCollapse: () => void
  onQuit: () => void
  onSettingsChange: (settings: AppSettings) => void
  onToggleLaunch: (enabled: boolean) => void
}

export function TaskList(props: TaskListProps): JSX.Element {
  const {
    tasks,
    completed,
    total,
    allDone,
    dockSide,
    onToggle,
    onEdit,
    onDelete,
    onAdd,
    onReorder,
    onSetDock,
    onCollapse,
    onQuit,
    onSettingsChange,
    version,
    launchAtStartup,
    onToggleLaunch
  } = props
  const [newText, setNewText] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const drag = useEdgeDrag(onSettingsChange)

  // Always render incomplete tasks first, completed ones sunk to the bottom.
  // (Stable sort keeps each group's manual drag order.)
  const ordered = useMemo(
    () => [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed)),
    [tasks]
  )

  const submit = (): void => {
    if (!newText.trim()) return
    onAdd(newText)
    setNewText('')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, ease: 'linear' }}
      className="relative flex h-screen w-screen flex-col overflow-hidden rounded-lg border-2 border-cherry bg-cream shadow-bookmark"
    >
      {/* Title bar — drag to move the window, double-click to collapse */}
      <div
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
        onDoubleClick={onCollapse}
        title="Drag to move · double-click to collapse"
        className="flex cursor-grab select-none items-center justify-between bg-cherry px-2 py-1 text-cream active:cursor-grabbing"
      >
        <div className="flex items-center gap-1.5">
          <img src={cherryPair} alt="" className="h-4 w-4" draggable={false} />
          <span className="text-xs font-bold tracking-wide">Today's Tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Settings"
            title="Settings"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setShowSettings(true)}
            className="btn-95 grid h-4 w-5 place-items-center"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#D7263D" strokeWidth="2">
              <circle cx="8" cy="8" r="2.5" />
              <path
                d="M8 1v2.3M8 12.7V15M1 8h2.3M12.7 8H15M3 3l1.6 1.6M11.4 11.4 13 13M13 3l-1.6 1.6M4.6 11.4 3 13"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            aria-label="Collapse to tab"
            title="Collapse"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onCollapse}
            className="btn-95 grid h-4 w-5 place-items-center"
          >
            <svg width="9" height="9" viewBox="0 0 9 9">
              <rect x="1" y="6" width="7" height="1.8" fill="#5C4033" />
            </svg>
          </button>
          <button
            aria-label="Quit cherryTodo"
            title="Quit"
            onClick={onQuit}
            className="btn-95 grid h-4 w-5 place-items-center"
          >
            <svg width="9" height="9" viewBox="0 0 9 9">
              <path
                d="M1.5 1.5 L7.5 7.5 M7.5 1.5 L1.5 7.5"
                stroke="#5C4033"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-center gap-2 border-b-2 border-dashed border-pink py-2">
        <img src={cherryPair} alt="" className="h-5 w-5" draggable={false} />
        <h1 className="text-base font-bold text-cherry">Today's Tasks</h1>
        <img src={cherryPair} alt="" className="h-5 w-5" draggable={false} />
      </div>

      {/* List / celebration */}
      <div className="flex-1 overflow-y-auto">
        {total === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-brown-soft">
            No tasks yet — add your first one below! 🍒
          </p>
        ) : (
          <>
            {allDone && <AllDone count={total} />}
            <Reorder.Group axis="y" values={ordered} onReorder={onReorder} className="list-none">
              {ordered.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </Reorder.Group>
          </>
        )}
      </div>

      {/* Add task */}
      <div className="flex items-center gap-1.5 border-t-2 border-dashed border-pink p-2">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Add a task…"
          className="sunken-95 min-w-0 flex-1 px-2 py-1 text-sm outline-none"
        />
        <button
          onClick={submit}
          className="btn-95 px-2 py-1 text-sm font-bold text-cherry"
          aria-label="Add task"
        >
          +
        </button>
      </div>

      {/* Footer: progress + dock controls */}
      <div className="flex items-center justify-between bg-pink-soft px-2 py-1 text-[11px] text-brown">
        <span className="font-bold">
          {completed} / {total} done
        </span>
        <div className="flex items-center gap-1">
          <span className="text-brown-soft">Dock:</span>
          <button
            onClick={() => onSetDock('left')}
            className={`btn-95 px-1.5 py-0.5 ${dockSide === 'left' ? 'text-cherry' : 'text-brown-soft'}`}
          >
            ◀ Left
          </button>
          <button
            onClick={() => onSetDock('right')}
            className={`btn-95 px-1.5 py-0.5 ${dockSide === 'right' ? 'text-cherry' : 'text-brown-soft'}`}
          >
            Right ▶
          </button>
        </div>
      </div>

      {showSettings && (
        <Settings
          version={version}
          launchAtStartup={launchAtStartup}
          onToggleLaunch={onToggleLaunch}
          onClose={() => setShowSettings(false)}
        />
      )}
    </motion.div>
  )
}
