import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useCherry } from './hooks/useCherry'
import { Bookmark } from './components/Bookmark'
import { TaskList } from './components/TaskList'

export default function App(): JSX.Element {
  const cherry = useCherry()
  const [expanded, setExpanded] = useState(false)

  const expand = (): void => {
    setExpanded(true)
    window.cherry.setExpanded(true)
  }

  const collapse = (): void => {
    setExpanded(false)
    window.cherry.setExpanded(false)
  }

  if (!cherry.ready) return <div className="h-screen w-screen bg-transparent" />

  return (
    <AnimatePresence initial={false}>
      {expanded ? (
        <TaskList
          key="list"
          tasks={cherry.tasks}
          completed={cherry.completed}
          total={cherry.total}
          allDone={cherry.allDone}
          dockSide={cherry.settings.dockSide}
          version={cherry.version}
          launchAtStartup={cherry.settings.launchAtStartup}
          onToggle={cherry.toggleTask}
          onEdit={cherry.editTask}
          onDelete={cherry.deleteTask}
          onAdd={cherry.addTask}
          onReorder={cherry.reorderTasks}
          onSetDock={cherry.setDock}
          onCollapse={collapse}
          onQuit={() => window.cherry.quit()}
          onSettingsChange={cherry.syncSettings}
          onToggleLaunch={cherry.setLaunchAtStartup}
        />
      ) : (
        <Bookmark
          key="bookmark"
          completed={cherry.completed}
          total={cherry.total}
          allDone={cherry.allDone}
          dockSide={cherry.settings.dockSide}
          onExpand={expand}
          onSettingsChange={cherry.syncSettings}
        />
      )}
    </AnimatePresence>
  )
}
