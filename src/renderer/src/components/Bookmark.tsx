import { motion } from 'framer-motion'
import type { AppSettings, DockSide } from '../types'
import { Cherries } from './Cherries'
import { useEdgeDrag } from '../hooks/useEdgeDrag'

interface BookmarkProps {
  completed: number
  total: number
  allDone: boolean
  dockSide: DockSide
  onExpand: () => void
  onSettingsChange: (settings: AppSettings) => void
}

/**
 * The collapsed widget: a small rectangular cherry **side tab** that hugs the
 * left or right screen edge (flat inner edge, rounded outer corners) — like a
 * page index tab peeking out of the desktop. Double-click to expand;
 * press-and-drag to reposition (it snaps to the nearest edge on release).
 */
export function Bookmark({
  completed,
  total,
  allDone,
  dockSide,
  onExpand,
  onSettingsChange
}: BookmarkProps): JSX.Element {
  const drag = useEdgeDrag(onSettingsChange)
  const dockClass = dockSide === 'left' ? 'dock-left' : 'dock-right'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, ease: 'linear' }}
      className="flex h-screen w-screen cursor-grab select-none items-center justify-center active:cursor-grabbing"
      onPointerDown={drag.onPointerDown}
      onPointerMove={drag.onPointerMove}
      onPointerUp={drag.onPointerUp}
      onDoubleClick={onExpand}
      title="Double-click to expand · drag to move"
    >
      <div
        className={`gingham collapsed-tab ${dockClass} flex h-full w-full items-center justify-center overflow-hidden`}
      >
        <Cherries completed={completed} total={total} size={60} celebrate={allDone} />
      </div>
    </motion.div>
  )
}
