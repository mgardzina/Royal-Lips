"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Check } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isAlert?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Potwierdź",
  cancelText = "Anuluj",
  variant = "warning",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colors = {
    danger: {
      bg: "bg-red-50",
      icon: "text-red-600",
      btn: "bg-red-600 hover:bg-red-700",
      Icon: AlertTriangle,
    },
    warning: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      btn: "bg-[#8b7355] hover:bg-[#7a6548]",
      Icon: AlertTriangle,
    },
    info: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      btn: "bg-blue-600 hover:bg-blue-700",
      Icon: AlertTriangle,
    },
    success: {
      bg: "bg-green-50",
      icon: "text-green-600",
      btn: "bg-green-600 hover:bg-green-700",
      Icon: Check,
    },
  }[variant];

  const Icon = colors.Icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onCancel()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-full ${colors.bg}`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-serif text-[#4a4540] mb-2">{title}</h3>
            <p className="text-[#8b8580] text-sm leading-relaxed">{message}</p>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex gap-3">
            {!isAlert && (
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-xl transition-all shadow-md active:scale-95 ${colors.btn}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
