"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function ToastItem({ toast, onDismiss }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm shadow-lg ${
        toast.type === "error"
          ? "border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] text-destructive"
          : "border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] text-emerald-700"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p>{toast.message}</p>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((message, type = "success", duration = 4000) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration) {
      setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-6 top-6 z-[60] flex w-[90vw] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
