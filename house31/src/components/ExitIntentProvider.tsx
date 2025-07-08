'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { ExitIntentModal } from '@/components/ExitIntentModal'
import { useExitIntent } from '@/hooks/useExitIntent'

interface ExitIntentContextType {
  showModal: () => void
  hideModal: () => void
  isModalOpen: boolean
}

const ExitIntentContext = createContext<ExitIntentContextType | undefined>(undefined)

export function useExitIntentModal() {
  const context = useContext(ExitIntentContext)
  if (!context) {
    throw new Error('useExitIntentModal must be used within ExitIntentProvider')
  }
  return context
}

interface ExitIntentProviderProps {
  children: ReactNode
  enabled?: boolean
}

export function ExitIntentProvider({ children, enabled = true }: ExitIntentProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasShownModal, setHasShownModal] = useState(false)

  const showModal = () => {
    if (!hasShownModal) {
      setIsModalOpen(true)
      setHasShownModal(true)
    }
  }

  const hideModal = () => {
    setIsModalOpen(false)
  }

  // Set up exit intent detection
  useExitIntent({
    threshold: 50,
    delay: 10000, // 10 seconds of inactivity
    onExitIntent: enabled ? showModal : undefined
  })

  const contextValue: ExitIntentContextType = {
    showModal,
    hideModal,
    isModalOpen
  }

  return (
    <ExitIntentContext.Provider value={contextValue}>
      {children}
      <ExitIntentModal 
        isOpen={isModalOpen} 
        onClose={hideModal}
      />
    </ExitIntentContext.Provider>
  )
}
