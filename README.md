# 🍒 cherryTodo

A tiny floating retro to-do widget that lives on the edge of your screen.

cherryTodo stays always-on-top and takes almost no space. Collapsed, it's a little
pixel-art cherry **side tab** stuck to the left or right edge of your monitor. The two
cherries show your progress at a glance — **left cherry = completed**, **right cherry =
total**. Double-click to unfurl your task list; double-click again to tuck it back away.

---

## ✨ Features

- **Always on top** — pinned above every other window (even fullscreen apps).
- **Collapsed side tab** — a tiny rounded cherry tab that hugs the left or right screen edge.
- **Cherry progress counter** — completed / total drawn _inside_ the two cherries.
- **Full task management** — add, edit (double-click a task), delete, check/uncheck, and
  **drag-and-drop reorder**.
- **Completed tasks sink to the bottom** automatically.
- **Drag to reposition** — grab the tab (or the title bar) and drag; it snaps to the nearest
  edge and remembers where you left it.
- **Launch at startup** — optional auto-start when you log in (Settings).
- **Local JSON storage** — no database, fully offline. Everything lives in `tasks.json`.
- **Retro pixel font** (Mona) bundled locally.
- **Cute completion state** — `🍒✨ ALL DONE ✨🍒` with a gentle bounce + sparkle.

---

## 🎨 Design

| Token       | Color     |
| ----------- | --------- |
| Cherry Red  | `#D7263D` |
| Soft Pink   | `#FFD6E0` |
| Cream       | `#FFF5E4` |
| Dark Brown  | `#5C4033` |

Pixel-art-inspired, Windows 95 / XP aesthetic, cozy study vibe, minimal footprint.

---

## 🧱 Tech Stack

Electron · React · TypeScript · Tailwind CSS · Framer Motion · electron-store · electron-vite

---

## 📁 Project Structure

```
Cheery-Todo/
├── electron.vite.config.ts        # Build config for main / preload / renderer
├── electron-builder.yml           # Windows + macOS packaging config
├── tailwind.config.mjs
├── postcss.config.mjs
├── tsconfig*.json
├── scripts/
│   └── make-icon.mjs              # build/icon.svg -> icon.ico (Win) + icon.png (mac)
├── build/
│   └── icon.svg                   # Source app icon (auto-converted to icon.ico)
└── src/
    ├── shared/
    │   └── types.ts               # Types + window-size constants shared everywhere
    ├── main/
    │   ├── index.ts               # Window creation, always-on-top, dock + resize, IPC
    │   └── store.ts               # electron-store persistence (tasks.json)
    ├── preload/
    │   ├── index.ts               # Typed contextBridge API (window.cherry)
    │   └── index.d.ts             # Global Window typing
    └── renderer/
        ├── index.html
        └── src/
            ├── main.tsx
            ├── App.tsx            # Collapsed/expanded orchestration
            ├── index.css          # Tailwind + retro Win95 styling
            ├── hooks/
            │   ├── useCherry.ts   # State loading + write-through persistence
            │   └── useEdgeDrag.ts # Press-and-drag window move + edge snap
            ├── components/
            │   ├── Bookmark.tsx   # Collapsed cherry side-tab (CSS) + drag-to-dock
            │   ├── Cherries.tsx   # The cherry counter (numbers inside fruit)
            │   ├── TaskList.tsx   # Expanded window
            │   ├── TaskItem.tsx   # Row: checkbox, edit, delete, reorder handle
            │   ├── Settings.tsx   # Settings/about overlay (startup toggle, credit)
            │   └── AllDone.tsx    # Completion celebration
            └── assets/
                ├── cherry-pair.svg
                └── fonts/         # Mona12 retro pixel font (woff2) + OFL license
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (tested on Node 22)
- npm
- Windows (for the packaged build; dev mode also runs on macOS/Linux)

### Install

```bash
npm install
```

### Run in development (hot reload)

```bash
npm run dev
```

The bookmark appears docked to the right edge of your primary monitor. Double-click it.

---

## 📦 Build Installers

App icons are generated automatically from `build/icon.svg` (`npm run icon`,
which runs before every packaged build), so there's nothing to convert by hand.

### Windows (`.exe`)

```bash
npm run build:win
```

Output: `release/cherryTodo-1.0.0-Setup.exe` (NSIS installer)

### macOS (`.dmg`) — must be built on a Mac

```bash
npm run build:mac
```

Output (both architectures):

```
release/cherryTodo-1.0.0-arm64.dmg   # Apple Silicon (M1–M4)
release/cherryTodo-1.0.0-x64.dmg     # Intel
```

> macOS `.dmg` files can only be built **on macOS** — not from Windows.
> Building **unsigned** for local testing (skips code signing so the build
> won't fail without a certificate):
>
> ```bash
> CSC_IDENTITY_AUTO_DISCOVERY=false npm run build:mac
> ```
>
> Distributing/selling on macOS requires an **Apple Developer ID** ($99/yr) to
> sign + notarize the app — otherwise Gatekeeper warns users on first launch.

Unpacked test build (no installer): `npm run build:dir`.

---

## 💾 Where is my data stored?

Tasks and settings are saved as plain JSON (no database) via `electron-store`:

```
%APPDATA%/cherryTodo/tasks.json        # Windows
~/Library/Application Support/cherryTodo/tasks.json   # macOS
~/.config/cherryTodo/tasks.json        # Linux
```

Shape:

```json
{
  "tasks": [{ "id": "t1", "text": "Read Paper", "completed": true }],
  "settings": { "dockSide": "right", "dockOffsetY": 120, "launchAtStartup": false }
}
```

It loads automatically on startup and is written through on every change.

