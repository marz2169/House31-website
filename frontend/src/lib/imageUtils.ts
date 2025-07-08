// Helper function to preload images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

// Helper function to convert image to WebP if supported
export const getWebPUrl = (originalUrl: string): string => {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  
  if (supportsWebP && originalUrl.includes('placeholder.com')) {
    return originalUrl + '&format=webp'
  }
  
  return originalUrl
}
