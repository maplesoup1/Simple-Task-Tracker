import { useState, useCallback } from 'react'

export interface UseModalReturn<T = any> {
  isOpen: boolean
  data: T | null
  open: (data?: T) => void
  close: () => void
  toggle: () => void
}

export const useModal = <T = any>(initialState = false): UseModalReturn<T> => {
  const [isOpen, setIsOpen] = useState(initialState)
  const [data, setData] = useState<T | null>(null)

  const open = useCallback((modalData?: T) => {
    setIsOpen(true)
    if (modalData !== undefined) {
      setData(modalData)
    }
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  }
}
