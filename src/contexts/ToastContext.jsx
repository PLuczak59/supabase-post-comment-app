import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

const TOAST_DURATION = 3000

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const showToast = useCallback((msg, duration = TOAST_DURATION) => {
    setMessage(msg)
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setMessage('')
    }, duration)
    return () => clearTimeout(t)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && message && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-neutral-200 bg-neutral-800 px-5 py-3 text-sm font-medium text-white shadow-lg dark:border-neutral-600 dark:bg-neutral-700"
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
