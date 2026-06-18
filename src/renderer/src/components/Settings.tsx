import { motion } from 'framer-motion'
import { CREDIT } from '../../../shared/types'
import cherryPair from '../assets/cherry-pair.svg'

interface SettingsProps {
  version: string
  launchAtStartup: boolean
  onToggleLaunch: (enabled: boolean) => void
  onClose: () => void
}

/** Settings / about overlay shown on top of the task list. */
export function Settings({
  version,
  launchAtStartup,
  onToggleLaunch,
  onClose
}: SettingsProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, ease: 'linear' }}
      className="absolute inset-0 z-10 flex flex-col bg-cream"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-cherry px-2 py-1 text-cream">
        <span className="text-xs font-bold tracking-wide">⚙ Settings</span>
        <button
          aria-label="Close settings"
          title="Back"
          onClick={onClose}
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

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
        {/* Launch at startup */}
        <section className="rounded-md border-2 border-pink bg-pink-soft/70 p-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight text-brown">컴퓨터 시작 시 자동 실행</p>
              <p className="text-[11px] leading-tight text-brown-soft">Launch at startup</p>
            </div>
            <button
              role="switch"
              aria-checked={launchAtStartup}
              aria-label="Launch at startup"
              onClick={() => onToggleLaunch(!launchAtStartup)}
              className={`relative h-5 w-10 flex-none rounded-full border-2 border-cherry transition-colors duration-150 ${
                launchAtStartup ? 'bg-cherry' : 'bg-cream'
              }`}
            >
              <span
                className={`absolute top-[2px] h-3 w-3 rounded-full transition-all duration-150 ${
                  launchAtStartup ? 'left-[22px] bg-cream' : 'left-[2px] bg-cherry'
                }`}
              />
            </button>
          </div>
          <p className="mt-1.5 text-[11px] leading-snug text-brown-soft">
            로그인하면 자동으로 켜집니다 · Opens automatically at login.
          </p>
        </section>

        {/* About / credit */}
        <section className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <img src={cherryPair} alt="" className="h-8 w-8" draggable={false} />
          <div>
            <p className="text-sm font-bold text-cherry">🍒 CherryTodo</p>
            <p className="text-[11px] text-brown-soft">v{version || '1.0.0'}</p>
          </div>

          <p className="mt-1 text-xs text-brown">
            made by <span className="font-bold text-cherry">{CREDIT.author}</span>
          </p>

          <button
            onClick={() => window.cherry.openExternal(CREDIT.instagramUrl)}
            className="btn-95 flex items-center gap-1 px-2 py-1 text-xs font-bold text-cherry"
            title="Open Instagram"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="#D7263D" strokeWidth="2" />
              <circle cx="12" cy="12" r="4.5" stroke="#D7263D" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1.4" fill="#D7263D" />
            </svg>
            @{CREDIT.instagram}
          </button>

          <p className="mt-1 text-[10px] text-brown-soft">
            © 2026 {CREDIT.author}. All rights reserved.
          </p>
        </section>
      </div>
    </motion.div>
  )
}
