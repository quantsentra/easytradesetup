// Stub for the missing tweaks-panel.jsx file referenced by
// brand-kit.html line 64. The design team's handoff package shipped
// the HTML but not this companion module, so React was crashing on
// undefined components AND the useTweaks hook at line 2024.
//
// IMPORTANT: each <script type="text/babel"> block is eval'd in its
// own scope by Babel-standalone, so plain `function Foo(){}`
// declarations are NOT visible to the main inline script. Attach
// every export to `window` so the bare identifiers in the main
// app's JSX resolve to these stubs.
//
// Drop in the real design-team file later (same name, same dir) and
// it will overwrite these stubs.

// State hook — returns [tweaks, setTweak] where setTweak is
// (key, value) => void.  Real impl probably persists to localStorage;
// stub is in-memory only, which is enough to keep the kit rendering.
window.useTweaks = function useTweaks(initial) {
  const [state, setState] = React.useState(initial || {});
  const setTweak = React.useCallback(
    (key, value) => setState(function (prev) {
      return Object.assign({}, prev, { [key]: value });
    }),
    [],
  );
  return [state, setTweak];
};

// Side-panel components — stub to null so the kit chrome renders
// without the floating tweaks UI.
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
