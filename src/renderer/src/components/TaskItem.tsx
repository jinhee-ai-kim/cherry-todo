import { useEffect, useRef, useState } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import type { Task } from '../types'
import cherryPair from '../assets/cherry-pair.svg'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps): JSX.Element {
  const controls = useDragControls()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const commit = (): void => {
    setEditing(false)
    if (draft.trim() && draft !== task.text) onEdit(task.id, draft)
    else setDraft(task.text)
  }

  return (
    <Reorder.Item
      value={task}
      dragListener={false}
      dragControls={controls}
      className="group flex items-center gap-2 border-b border-dashed border-pink/80 px-2 py-2"
    >
      {/* Drag handle */}
      <button
        aria-label="Drag to reorder"
        onPointerDown={(e) => controls.start(e)}
        className="no-drag cursor-grab text-brown-soft/60 hover:text-cherry active:cursor-grabbing"
      >
        <svg width="8" height="16" viewBox="0 0 8 16" fill="currentColor">
          <circle cx="2" cy="3" r="1.4" />
          <circle cx="6" cy="3" r="1.4" />
          <circle cx="2" cy="8" r="1.4" />
          <circle cx="6" cy="8" r="1.4" />
          <circle cx="2" cy="13" r="1.4" />
          <circle cx="6" cy="13" r="1.4" />
        </svg>
      </button>

      {/* Retro checkbox */}
      <button
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        onClick={() => onToggle(task.id)}
        className="sunken-95 grid h-5 w-5 flex-none place-items-center"
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-cherry">
            <path
              d="M2 6 L5 9 L10 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="square"
            />
          </svg>
        )}
      </button>

      {/* Text / edit field */}
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') {
              setDraft(task.text)
              setEditing(false)
            }
          }}
          className="sunken-95 min-w-0 flex-1 px-1 py-0.5 text-sm outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`min-w-0 flex-1 truncate text-sm ${
            task.completed ? 'text-brown-soft/60 line-through' : 'text-brown'
          }`}
          title={task.text}
        >
          {task.text}
        </span>
      )}

      {/* Delete button (appears on hover) */}
      <button
        aria-label="Delete task"
        onClick={() => onDelete(task.id)}
        className="no-drag flex-none text-brown-soft/40 opacity-0 transition hover:text-cherry group-hover:opacity-100"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
          <path d="M2 2 L10 10 M10 2 L2 10" strokeLinecap="round" />
        </svg>
      </button>

      {/* Cherry decoration */}
      <img src={cherryPair} alt="" className="h-5 w-5 flex-none opacity-90" draggable={false} />
    </Reorder.Item>
  )
}
