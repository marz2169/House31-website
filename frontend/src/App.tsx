import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from '@/components/Layout'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/components/ThemeProvider'

// Lazy load pages for better code splitting
const HomePage = lazy(() => import('@/pages/HomePage'))
const NewsPage = lazy(() => import('@/pages/NewsPage'))
const EntertainmentPage = lazy(() => import('@/pages/EntertainmentPage'))
const VideosPage = lazy(() => import('@/pages/VideosPage'))
const PostDetailPage = lazy(() => import('@/pages/PostDetailPage'))
const SearchResultsPage = lazy(() => import('@/pages/SearchResultsPage'))
const MonitoringDashboard = lazy(() => import('@/pages/MonitoringDashboard'))

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen bg-background dark:bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-white mx-auto mb-4"></div>
        <p className="text-muted-foreground dark:text-gray-300">Loading...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/entertainment" element={<EntertainmentPage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/post/:slug" element={<PostDetailPage />} />
                <Route path="/monitoring" element={<MonitoringDashboard />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
