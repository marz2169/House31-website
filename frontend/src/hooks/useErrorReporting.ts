// Hook for error reporting (could be extended with external services)
export function useErrorReporting() {
  const reportError = (error: Error, context?: string) => {
    console.error('Error reported:', { error, context })
    
    // In production, you could send this to an error tracking service
    // like Sentry, LogRocket, or Bugsnag
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { tags: { context } })
    }
  }

  return { reportError }
}
