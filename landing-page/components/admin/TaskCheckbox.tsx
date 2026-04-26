"use client";

import { useState, useTransition } from "react";
import { toggleTask, setTaskNote } from "@/app/admin/checklist/actions";

type Props = {
  slug: string;
  title: string;
  detail?: string | null;
  initialDone: boolean;
  initialNote: string | null;
  doneAt: string | null;
  doneBy: string | null;
};

export default function TaskCheckbox({ slug, title, detail, initialDone, initialNote, doneAt, doneBy }: Props) {
  const [done, setDone] = useState(initialDone);
  const [note, setNote] = useState(initialNote || "");
  const [editingNote, setEditingNote] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onToggle() {
    const next = !done;
    setDone(next);
    setError(null);
    startTransition(async () => {
      const r = await toggleTask(slug, next);
      if (!r.ok) {
        setDone(!next);
        setError(r.error || "Failed");
      }
    });
  }

  function onSaveNote() {
    setEditingNote(false);
    startTransition(async () => {
      const r = await setTaskNote(slug, note);
      if (!r.ok) setError(r.error || "Save failed");
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={done}
          onChange={onToggle}
          disabled={isPending}
          style={{
            marginTop: 3,
            width: 18, height: 18,
            accentColor: "#2B7BFF",
            cursor: "pointer",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            font: "600 14px var(--tz-sans)",
            color: done ? "var(--tz-ink-mute)" : "var(--tz-ink)",
            textDecoration: done ? "line-through" : "none",
            lineHeight: 1.4,
          }}>
            {title}
          </div>
          {detail && (
            <div className="text-[12.5px]" style={{
              color: "var(--tz-ink-mute)", marginTop: 3,
              textDecoration: done ? "line-through" : "none",
              lineHeight: 1.5,
            }}>
              {detail}
            </div>
          )}
          {done && doneAt && (
            <div className="font-mono" style={{
              fontSize: 10.5, color: "var(--tz-win)",
              letterSpacing: ".04em", textTransform: "uppercase",
              marginTop: 4,
            }}>
              ✓ Done {new Date(doneAt).toISOString().slice(0, 10)} {doneBy ? `· ${doneBy.split("@")[0]}` : ""}
            </div>
          )}
        </div>
      </label>

      {/* Note row */}
      <div style={{ marginLeft: 30, marginTop: 6 }}>
        {editingNote ? (
          <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={2000}
              autoFocus
              style={{
                flex: 1, fontSize: 12, padding: "6px 10px",
                border: "1px solid var(--tz-border-2)", borderRadius: 6,
                fontFamily: "var(--tz-sans)",
                resize: "vertical", minHeight: 50,
              }}
              placeholder="Notes, links, blockers…"
            />
            <button type="button" onClick={onSaveNote}
              className="tz-btn tz-btn-primary"
              style={{ height: 28, padding: "0 10px", fontSize: 11.5 }}>
              Save
            </button>
            <button type="button" onClick={() => { setEditingNote(false); setNote(initialNote || ""); }}
              className="tz-btn"
              style={{ height: 28, padding: "0 10px", fontSize: 11.5 }}>
              Cancel
            </button>
          </div>
        ) : note ? (
          <div style={{
            fontSize: 12, color: "var(--tz-ink-dim)",
            background: "var(--tz-surface-2)", borderRadius: 6,
            padding: "6px 10px",
            display: "flex", justifyContent: "space-between", gap: 8,
            cursor: "pointer",
          }} onClick={() => setEditingNote(true)}>
            <span style={{ whiteSpace: "pre-wrap", flex: 1 }}>{note}</span>
            <span className="font-mono" style={{ fontSize: 10, color: "var(--tz-ink-mute)" }}>edit</span>
          </div>
        ) : (
          <button type="button" onClick={() => setEditingNote(true)}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 11, color: "var(--tz-ink-mute)",
              padding: 0, fontFamily: "var(--tz-mono)",
              letterSpacing: ".06em", textTransform: "uppercase",
            }}>
            + add note
          </button>
        )}
      </div>

      {error && (
        <div style={{
          marginLeft: 30, fontSize: 11.5, color: "var(--tz-loss)",
          fontFamily: "var(--tz-mono)",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
