// Stub for the missing tweaks-panel.jsx file referenced by
// brand-kit.html line 64. The design team's handoff package shipped
// the HTML but not this companion module, so React was crashing on
// 5 undefined components at line 2078.
//
// IMPORTANT: each <script type="text/babel"> block is eval'd in its
// own scope by Babel-standalone, so plain `function Foo(){}`
// declarations are NOT visible to the main inline script. We attach
// each component to `window` so the bare identifiers in the main
// app's JSX resolve to these stubs.
//
// All components return null so the kit renders without the tweaks
// side panel. Drop in the real design-team file later — same name,
// same dir — and it will overwrite these stubs.

window.TweaksPanel = function TweaksPanel({ title, children }) {
  return null;
};

window.TweakSection = function TweakSection({ label }) {
  return null;
};

window.TweakColor = function TweakColor({ label, value, onChange }) {
  return null;
};

window.TweakToggle = function TweakToggle({ label, value, onChange }) {
  return null;
};

window.TweakButton = function TweakButton({ label, onClick }) {
  return null;
};
