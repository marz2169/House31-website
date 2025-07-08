// Utility functions for the application

// Helper function to get author name from either string or object format
export function getAuthorName(author?: string | { name: string; email?: string }): string {
  if (typeof author === 'string') {
    return author || 'Anonymous'
  } else if (typeof author === 'object' && author?.name) {
    return author.name
  }
  return 'Anonymous'
}

// Helper function to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

// Helper function to get category display name
export function getCategoryDisplayName(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}
