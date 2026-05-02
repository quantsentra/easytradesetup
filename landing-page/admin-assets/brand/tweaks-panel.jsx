// Stub for the missing tweaks-panel.jsx file referenced by
// brand-kit.html line 64. The design team's handoff package shipped
// the HTML but not this companion module, so React was crashing on
// 5 undefined components at line 2078.
//
// All components return null so the kit renders without the tweaks
// side panel. If/when the design team ships the real file, drop it
// in beside this stub and the original implementation takes over.

function TweaksPanel({ title, children }) {
  return null;
}

function TweakSection({ label }) {
  return null;
}

function TweakColor({ label, value, onChange }) {
  return null;
}

function TweakToggle({ label, value, onChange }) {
  return null;
}

function TweakButton({ label, onClick }) {
  return null;
}
