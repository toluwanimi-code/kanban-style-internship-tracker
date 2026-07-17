# Internship Application Tracker — Software Design Document

**Project codename:** Internship Tracker (Stardance)
**Author:** Toluwanimi
**Status:** Draft — core engineering design phase

---

## 1. Overview

A kanban-style web app for tracking personal internship applications through stages:
**Wishlist → Applied → Interviewing → Offer / Rejected**

Each user has their own account and their own board, backed by a Supabase database. The primary engineering goal of this project is **not** the UI — it is building a correct, hand-rolled **undo/redo action-log system** and **cross-column drag-and-drop state management** in vanilla JavaScript, without relying on a framework's state library.

---

## 2. Goals

- A working kanban board with drag-and-drop cards across stage columns.
- A real undo/redo system (multi-step, not just "undo last drag").
- User accounts (sign up / log in) via Supabase Auth.
- Each user's board data persisted and isolated in a Supabase (Postgres) database.
- Plain, functional UI — this is a state-management project, not a design project.

### Non-goals (for v1)
- Polished visual design / animation.
- Team boards or shared/collaborative boards.
- Notifications, reminders, or email integration.

---

## 3. Core Architecture Principle

**All state changes flow through a single `dispatch(action)` function.**

No code is allowed to mutate board state directly (no `card.stage = 'applied'` anywhere outside the dispatch system). Every change — drag-and-drop, add card, edit card, delete card — is represented as an **action object**, and the action log is what makes undo/redo possible.

```
User interaction → build action object → dispatch(action) → apply to state → push to undo stack → re-render
```

Undo = pop from undo stack, apply the inverse of that action, push it to the redo stack.
Redo = pop from redo stack, re-apply the original action, push it back to undo stack.

---

## 4. Data Model

### Card (Application)
```js
{
  id: string,          // unique id
  userId: string,      // owner — every card belongs to exactly one user
  company: string,
  role: string,
  stage: 'wishlist' | 'applied' | 'interviewing' | 'offer' | 'rejected',
  position: number,    // order within its column
  createdAt: string,
  notes: string        // optional
}
```

`userId` is included here even though Supabase's RLS will also enforce ownership at the database level. Documenting it on the card itself matters because the client-side state needs to know whose data it's holding — e.g. to filter, to validate before dispatch, and so the shape of a "card" doesn't silently change between local state and the database row.

### Board state (client-side, in memory)
```js
{
  columns: {
    wishlist:      [cardId, cardId, ...],
    applied:       [cardId, ...],
    interviewing:  [cardId, ...],
    offer:         [cardId, ...],
    rejected:      [cardId, ...]
  },
  cardsById: {
    [cardId]: CardObject
  }
}
```

### Why this structure (normalized state)

The board is deliberately **normalized**: each card exists exactly once, in `cardsById`, keyed by its id. The columns don't store card objects — they store ordered arrays of card *ids*.

This matters for two reasons:
- **No duplication.** If a card lived directly inside a column array, moving it to another column would mean copying the whole object across arrays — and any edit to a card would require finding and updating every copy of it. With normalization, a card is edited in exactly one place (`cardsById[id]`), regardless of which column it's currently in.
- **Cheap moves.** A `MOVE_CARD` action only has to touch two arrays of ids (remove from one, insert into the other) — it never touches the card object itself. This keeps the undo/redo action log lightweight, since a move action only needs to record id + index changes, not a full card payload.

This is the same normalization pattern used by Redux and most serious state-management systems, for exactly this reason.

### Full application state

The board state above is only *part* of the app's state — not the whole picture. The full client-side state shape is:

```js
{
  currentUser: null,      // set after Supabase auth resolves

  board: {
    columns: {...},
    cardsById: {...}
  },

  undoStack: [],
  redoStack: [],

  loading: false,         // true during auth/data fetches
  error: null             // last error, if any, for UI display
}
```

This is the single source of truth for the whole app. Keeping `currentUser`, `loading`, and `error` here — instead of as scattered module-level variables — means the render layer has one object to read from, and there's no ambiguity later about where "is the user logged in" or "did the last fetch fail" actually lives.

---

## 5. Action Types

| Action        | Payload                                             | Undo behavior                       |
|---------------|------------------------------------------------------|--------------------------------------|
| `MOVE_CARD`   | `cardId, from: {stage, index}, to: {stage, index}`   | Move card back from `to` → `from`   |
| `ADD_CARD`    | `card, index`                                        | Remove the card                     |
| `EDIT_CARD`   | `cardId, before: {...fields}, after: {...fields}`    | Re-apply `before` fields             |
| `DELETE_CARD` | `card, stage, index`                                 | Re-insert card at same stage/index  |

Every action stores enough information to be reversed **without recomputation** — the "before" state is captured at dispatch time, not derived later.

---

## 6. Undo/Redo Engine

- `undoStack`: array of applied actions, most recent last.
- `redoStack`: cleared any time a *new* action is dispatched (standard editor behavior).
- `dispatch(action)`:
  1. Apply the action to state.
  2. Push action to `undoStack`.
  3. Clear `redoStack`.
  4. Re-render.
- `undo()`: pop from `undoStack`, apply its inverse, push to `redoStack`, re-render.
- `redo()`: pop from `redoStack`, re-apply it, push back to `undoStack`, re-render.

**Decision: command-object pattern.** Each action type has a paired `do`/`undo` handler (as opposed to storing a full-state snapshot per step). Chosen deliberately — not primarily for memory efficiency, but because building real inverse-per-action logic is the actual engineering challenge this project exists to practice.

---

## 7. Drag-and-Drop

- Uses native HTML5 Drag and Drop API (`dragstart`, `dragover`, `drop`) — no library.
- On drop: compute `from` (card's current stage + index) and `to` (target column + drop index), build a `MOVE_CARD` action, and send it through `dispatch()` — never mutate the DOM/state directly on drop.
- Rendering is a pure function of state: after any dispatch, the relevant column(s) re-render from `cardsById` + `columns`.

---

## 8. Persistence Layer (Supabase)

### Authentication
- Supabase Auth (email/password for v1).
- Each authenticated user has their own isolated board.
- Row-Level Security (RLS) ensures users can only read and modify their own application records.

### Database
The application uses a `cards` table in Supabase Postgres. Each row represents one internship application and includes:
- `id`
- `user_id`
- `company`
- `role`
- `stage`
- `position`
- `notes`
- `created_at`
- `updated_at`

---

### Design Decision: Local-First Architecture

This project adopts a **local-first architecture**, meaning the client-side application state is treated as the immediate source of truth during user interactions.

Every user action follows this sequence:

```
User Action
      ↓
Create Action Object
      ↓
dispatch(action)
      ↓
Update Local State
      ↓
Update Undo/Redo History
      ↓
Re-render UI
      ↓
Synchronize changes to Supabase (asynchronously)
```

The UI never waits for a database response before updating. This keeps interactions such as drag-and-drop and undo/redo responsive, even when network latency is high.

### Why Local-First?

The primary engineering focus of this project is explicit state management through a dispatch-driven architecture. Keeping local state as the primary working state allows:
- Instant UI updates.
- Immediate undo/redo operations.
- A predictable state flow where every mutation passes through `dispatch()`.
- A clear separation between state management and persistence.

Supabase is responsible for persistence, not for driving the application's runtime state.

### Synchronization Strategy

After every successful dispatch, the application asynchronously writes the updated state to Supabase.

```
dispatch(action)
      ↓
Local state updated
      ↓
Render updated UI
      ↓
Write changes to Supabase
```

This approach provides a responsive user experience while ensuring application data remains persistent.

### Handling Synchronization Failures

Because local state updates before the database write completes, synchronization failures are possible. If a write to Supabase fails:
- The local state remains unchanged.
- The user is notified that synchronization failed.
- The application can retry the write without affecting the undo/redo history.

This decision keeps the state-management system independent of temporary network issues while preserving a smooth user experience.

---

## 9. Build Order

1. Data model + action types (design only, no UI).
2. Undo/redo engine, tested in isolation with fake actions (no DOM).
3. Drag-and-drop wired through `dispatch()`.
4. Render layer (state → DOM).
5. Supabase Auth + database integration.
6. Stretch goals (card editing, notes, filtering, rejected-reason tracking, etc.)

---

## 10. State Flow

This project is fundamentally about state, so the full cycle deserves its own diagram — this is the architecture in one picture:

```
Initial State
      ↓
User drags card
      ↓
MOVE_CARD action created (from + to)
      ↓
dispatch(action)
      ↓
State updated (columns + cardsById)
      ↓
Undo Stack updated, Redo Stack cleared
      ↓
render()
      ↓
Browser displays new board
```

Undo follows the same shape in reverse:

```
User clicks Undo
      ↓
Pop last action off Undo Stack
      ↓
Apply inverse of that action to state
      ↓
Push original action onto Redo Stack
      ↓
render()
      ↓
Browser displays previous board state
```

Every feature added later — editing, deleting, filtering — has to fit into this same cycle. If a feature can't be expressed as "an action that goes through dispatch," it's a sign the feature needs rethinking, not an exception to the rule.

---

## 11. Open Questions

Core architecture decisions have been finalized for v1 (see Section 8). All that remains:

- [ ] Multi-card batch actions (e.g., bulk move) — in scope or stretch?

## 12. Future Considerations

- [ ] Labels and tags for applications.
- [ ] Search and filtering.
- [ ] Archived applications.
- [ ] Keyboard shortcuts (Ctrl+Z / Ctrl+Y).
- [ ] Offline synchronization and automatic conflict resolution.
- [ ] Real-time collaboration between multiple users.
