import { useRef } from 'react'
import type { AppSettings } from '../types'

const DRAG_THRESHOLD = 4

export interface EdgeDragHandlers {
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
}

/**
 * Press-and-drag the window along the screen by its grab area. Movement must
 * pass a small threshold before a drag starts, so a plain click or double-click
 * (no movement) still reaches the element's own handlers. On release the window
 * snaps to the nearest edge and the new side + vertical offset are persisted.
 *
 * Shared by the collapsed tab and the expanded title bar.
 */
export function useEdgeDrag(onSettingsChange: (settings: AppSettings) => void): EdgeDragHandlers {
  const startRef = useRef<{ sx: number; sy: number; wx: number; wy: number } | null>(null)
  const draggingRef = useRef(false)

  const onPointerDown = async (e: React.PointerEvent): Promise<void> => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    draggingRef.current = false
    const bounds = await window.cherry.getBounds()
    startRef.current = { sx: e.screenX, sy: e.screenY, wx: bounds.x, wy: bounds.y }
  }

  const onPointerMove = (e: React.PointerEvent): void => {
    const start = startRef.current
    if (!start) return
    const dx = e.screenX - start.sx
    const dy = e.screenY - start.sy
    if (!draggingRef.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    draggingRef.current = true
    window.cherry.moveTo(start.wx + dx, start.wy + dy)
  }

  const onPointerUp = async (e: React.PointerEvent): Promise<void> => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    startRef.current = null
    if (draggingRef.current) {
      const next = await window.cherry.snapDock()
      onSettingsChange(next)
    }
    draggingRef.current = false
  }

  return { onPointerDown, onPointerMove, onPointerUp }
}
