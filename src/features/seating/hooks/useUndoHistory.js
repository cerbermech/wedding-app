import { useCallback, useRef, useState } from "react";

export function useUndoHistory(initialValue, limit = 20) {
  const [present, setPresent] = useState(initialValue);
  const past = useRef([]);
  const future = useRef([]);
  const commit = useCallback((recipe) => {
    setPresent((current) => {
      const next = structuredClone(current);
      recipe(next);
      past.current = [...past.current.slice(-(limit - 1)), current];
      future.current = [];
      return next;
    });
  }, [limit]);
  const replace = useCallback((next, remember = true) => {
    setPresent((current) => {
      if (remember) past.current = [...past.current.slice(-(limit - 1)), current];
      future.current = [];
      return structuredClone(next);
    });
  }, [limit]);
  const undo = useCallback(() => setPresent((current) => {
    const previous = past.current.pop();
    if (!previous) return current;
    future.current.push(current);
    return previous;
  }), []);
  const redo = useCallback(() => setPresent((current) => {
    const next = future.current.pop();
    if (!next) return current;
    past.current.push(current);
    return next;
  }), []);
  return { value: present, commit, replace, undo, redo, canUndo: () => past.current.length > 0, canRedo: () => future.current.length > 0 };
}
