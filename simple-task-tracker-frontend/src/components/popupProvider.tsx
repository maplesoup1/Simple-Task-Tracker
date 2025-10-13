import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import ConfirmModal from './confirmModal'

export interface ConfirmOptions {
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

interface PopupContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const PopupContext = createContext<PopupContextValue | undefined>(undefined)

const defaultOptions: Required<Omit<ConfirmOptions, 'message'>> = {
  title: 'Confirm Action',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel'
}

interface PopupProviderProps {
  children: React.ReactNode
}

const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({ ...defaultOptions, message: '' })
  const resolverRef = useRef<((value: boolean) => void) | null>(null)

  const closeModal = useCallback((result: boolean) => {
    setIsOpen(false)
    resolverRef.current?.(result)
    resolverRef.current = null
  }, [])

  const confirm = useCallback((confirmOptions: ConfirmOptions) => {
    return new Promise<boolean>(resolve => {
      resolverRef.current = resolve
      setOptions({
        title: confirmOptions.title ?? defaultOptions.title,
        confirmLabel: confirmOptions.confirmLabel ?? defaultOptions.confirmLabel,
        cancelLabel: confirmOptions.cancelLabel ?? defaultOptions.cancelLabel,
        message: confirmOptions.message
      })
      setIsOpen(true)
    })
  }, [])

  const handleConfirm = useCallback(() => {
    closeModal(true)
  }, [closeModal])

  const handleCancel = useCallback(() => {
    closeModal(false)
  }, [closeModal])

  return (
    <PopupContext.Provider value={{ confirm }}>
      {children}
      <ConfirmModal
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        confirmLabel={options.confirmLabel}
        cancelLabel={options.cancelLabel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </PopupContext.Provider>
  )
}

export const usePopup = () => {
  const context = useContext(PopupContext)
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider')
  }
  return context
}

export default PopupProvider
