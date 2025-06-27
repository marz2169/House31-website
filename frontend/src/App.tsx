import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">House31 Website</h1>
        <p className="text-lg text-gray-600">
          Modern entertainment and news hub
        </p>
        <div className="space-x-4">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
    </div>
  )
}

export default App
