# emilkowalski UI Skill

Use this skill when building interactive UI components for EasyTradeSetup using emilkowalski's libraries.

## Libraries in use

### vaul — Drawer / bottom sheet
- `import { Drawer } from 'vaul'`
- Use for: mobile nav, mobile detail panels, any bottom-sheet interaction
- Always include the drag handle: `<div className="mx-auto w-12 h-1 rounded-full bg-border mb-8" />`
- Wrap in `Drawer.Root > Drawer.Portal > (Drawer.Overlay + Drawer.Content)`

### sonner — Toast notifications
- `import { toast } from 'sonner'`
- `<Toaster />` lives in `app/layout.tsx` — already installed
- Toast style: dark bg `#161B22`, border `#30363D`, text `#E6EDF3`, radius 12px
- Use for: checkout clicks, form submissions, copy confirmations
- Keep messages short and action-oriented: "Opening checkout…", "Copied!"

### cmdk — Command palette
- `import { Command } from 'cmdk'`
- Trigger: `Cmd+K` / `Ctrl+K`
- `CommandPalette.tsx` is already wired in `app/page.tsx`
- Items: nav sections, buy links, support email
- Style: `data-[selected=true]:bg-bg-raised` for keyboard highlight

## Rules
- Never install alternatives (react-hot-toast, react-modal, etc.) — use these three
- Keep all three consistent with the dark design system (bg-bg-surface, border-border, text-ink)
