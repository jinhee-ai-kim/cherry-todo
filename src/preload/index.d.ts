import type { CherryApi } from './index'

declare global {
  interface Window {
    cherry: CherryApi
  }
}

export {}
