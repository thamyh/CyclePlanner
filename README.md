# Cycle Planner

A personal training cycle and diet phase planner built with Next.js, designed to run as an Android app via Capacitor.

## Features

- **Dashboard** — View today's and tomorrow's training session at a glance, and mark attendance
- **Calendar** — 6-month FullCalendar view with color-coded training cycle; export to CSV or ICS
- **Settings** — Configure custom training cycles (drag-and-drop reorder) and diet macro phases
- **Offline-first** — All data stored locally via `localforage` (no account or server required)
- **Android app** — Packaged as a native Android APK via Capacitor

## Tech Stack

- [Next.js 13](https://nextjs.org/) (App Router, static export)
- [Tailwind CSS](https://tailwindcss.com/) — dark glassmorphism UI
- [FullCalendar](https://fullcalendar.io/) — calendar view
- [@dnd-kit](https://dndkit.com/) — drag-and-drop cycle editor
- [localforage](https://localforage.github.io/localForage/) — offline storage
- [Capacitor](https://capacitorjs.com/) — Android packaging

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Android

```bash
npm run build       # generates the static output in /out
npx cap sync        # sync to the Android project
npx cap open android  # open in Android Studio
```

Or run `setup_apk.ps1` to automate the setup from scratch.

## Usage

1. Go to **Settings → Cycle Sequence** and create a training split (e.g., Push / Pull / Legs / Rest)
2. Set a start date and save — events are generated automatically for 6 months
3. Optionally go to **Settings → Diet & Macro Plan** to add diet phases
4. The **Dashboard** shows today's session and next rest day
5. The **Calendar** lets you view the full schedule and export to ICS for Google Calendar / Apple Calendar
