import React from 'react'

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
  retryLabel?: string
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  retryLabel = 'Retry'
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <div className="text-red-600 text-xl font-semibold mb-4">Error</div>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {retryLabel}
        </button>
      </div>
    </div>
  )
}

export default ErrorDisplay
