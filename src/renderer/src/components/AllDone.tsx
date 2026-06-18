import { motion } from 'framer-motion'
import { Cherries } from './Cherries'

interface AllDoneProps {
  count: number
}

/** Lightweight celebration shown when every task is checked off. */
export function AllDone({ count }: AllDoneProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center gap-1 px-3 py-4 text-center"
    >
      <Cherries completed={count} total={count} size={64} celebrate />
      <motion.p
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="text-sm font-bold tracking-wide text-cherry"
      >
        🍒✨ ALL DONE ✨🍒
      </motion.p>
      <p className="text-xs text-brown-soft">Great work — go enjoy a break!</p>
    </motion.div>
  )
}
