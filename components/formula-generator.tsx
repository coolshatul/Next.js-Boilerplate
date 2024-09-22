"use client";

import { useState, useEffect } from "react";

export function FormulaGeneratorComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pt-4">
      <p>hi......</p>
    </div>
  );
}
