"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from "lucide-react";

type ToastType = "success" | "error" | "info" | "ai";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-[2rem] shadow-2xl border backdrop-blur-xl
              animate-in slide-in-from-right-10 fade-in duration-500
              ${t.type === "success" ? "bg-emerald-600/90 border-emerald-500 text-white" : ""}
              ${t.type === "error" ? "bg-stone-950/90 border-rose-500 text-white" : ""}
              ${t.type === "info" ? "bg-stone-900/90 border-stone-800 text-white" : ""}
              ${t.type === "ai" ? "bg-amber-500/90 border-amber-400 text-white" : ""}
            `}
          >
            <div className="shrink-0">
              {t.type === "success" && <CheckCircle2 size={24} />}
              {t.type === "error" && <AlertCircle size={24} className="text-rose-500" />}
              {t.type === "info" && <Info size={24} className="text-stone-400" />}
              {t.type === "ai" && <Sparkles size={24} className="animate-pulse" />}
            </div>
            <p className="text-sm font-bold tracking-tight italic pr-4">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-auto p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
