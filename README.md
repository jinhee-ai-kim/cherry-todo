# 🍒 cherryTodo

A tiny floating retro to-do **bookmark** that lives on the edge of your screen.

cherryTodo stays always-on-top and takes almost no space. Collapsed, it's a little
pixel-art cherry bookmark stuck to the left or right edge of your monitor. The two
cherries show your progress at a glance — **left cherry = completed**, **right cherry =
total**. Double-click to unfurl your task list; double-click again to tuck it back away.

```
Collapsed            Expanded
  ╭──╮          ╭──────────────────╮
  │🍒│   ──▶   │ 🍒 Today's Tasks │
  │5 │          ├──────────────────┤
  │10│          │ ☑ Read Paper     │
  │ ◣│         │ ☑ Gym             │
  ╰──╯          │ ☐ Study          │
                │ ☐ Laundry        │
                │ ☐ Review Notes   │
                ╰──────────────────╯
```

---

## ✨ Features

- **Always on top** — pinned above every other window (even fullscreen apps).
- **Collapsed bookmark mode** — only **66 × 96 px**, docks flush to the left or right edge.
- **Cherry progress counter** — completed / total drawn _inside_ the two cherries.
- **Double-click to expand / collapse** with a smooth 200–300 ms animation.
- **Full task management** — add, edit (double-click a task), delete, check/uncheck, and
  **drag-and-drop reorder**.
- **Drag to reposition** — grab the bookmark and drag; it snaps to the nearest edge and
  remembers where you left it.
- **Local JSON storage** — no database. Everything lives in `tasks.json`.
- **Dock preference** — Left or Right, mirrored bookmark shape, remembered between launches.
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
├── electron-builder.yml           # Windows packaging config
├── tailwind.config.mjs
├── postcss.config.mjs
├── tsconfig*.json
├── scripts/
│   └── make-icon.mjs              # build/icon.svg -> build/icon.ico (multi-size)
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

### Type-check

```bash
npm run typecheck
```

---

## 📦 Build a Windows Executable

Produce an NSIS installer (`.exe`) in the `release/` folder:

```bash
npm run build:win
```

Output: `release/cherryTodo-1.0.0-Setup.exe`

Other targets:

```bash
npm run build:dir        # Unpacked app folder (no installer) — fast to test
electron-builder --win portable   # Single portable .exe (after `npm run build`)
```

### Branding the app icon (optional)

`build/icon.svg` is the source icon. Convert it to a multi-size `build/icon.ico`
(256×256 recommended) and electron-builder will pick it up automatically:

```bash
# Example using ImageMagick
magick build/icon.svg -define icon:auto-resize=256,128,64,48,32,16 build/icon.ico
```

Without an `icon.ico`, the default Electron icon is used.

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
  "settings": { "dockSide": "right", "dockOffsetY": 120 }
}
```

It loads automatically on startup and is written through on every change.

---

## 🖱️ Usage

| Action                         | How                                             |
| ------------------------------ | ----------------------------------------------- |
| Expand task list               | Double-click the bookmark                       |
| Collapse back to bookmark      | Double-click the title bar, or the `_` button   |
| Move the bookmark              | Press and drag it — releases snap to nearest edge |
| Switch dock side               | Footer **◀ Left** / **Right ▶** buttons         |
| Add task                       | Type in the box, press **Enter** or **+**       |
| Edit task                      | Double-click the task text                      |
| Complete / uncomplete          | Click the checkbox                              |
| Delete task                    | Hover the row, click the **✕**                  |
| Reorder                        | Drag the ⠿ handle on the left of a row          |
| Quit                           | Title bar **✕** button                          |

---

## License

MIT
