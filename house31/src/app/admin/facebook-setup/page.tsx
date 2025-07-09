"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"

export default function FacebookSetupPage() {
  const [step, setStep] = useState(1)
  const [facebookAppId, setFacebookAppId] = useState('')
  const [userToken, setUserToken] = useState('')
  const [pageToken, setPageToken] = useState('')
  const [pageId, setPageId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleGetUserToken = () => {
    if (!facebookAppId) {
      setError('Please enter your Facebook App ID first')
      return
    }

    const scopes = ['pages_show_list', 'pages_read_engagement', 'pages_read_user_content'].join(',')
    const redirectUri = `${window.location.origin}/admin/facebook-setup`
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token`
    
    window.open(facebookAuthUrl, 'facebook-auth', 'width=600,height=600')
  }

  const handleGetPageToken = async () => {
    if (!userToken) {
      setError('Please get a user access token first')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${userToken}`)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      if (data.data && data.data.length > 0) {
        // Show the first page found, user can select different one if needed
        const firstPage = data.data[0]
        setPageId(firstPage.id)
        setPageToken(firstPage.access_token)
        setSuccess(`Found page: ${firstPage.name}`)
        setStep(3)
      } else {
        setError('No pages found. Make sure you are an admin of a Facebook page.')
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied to clipboard!')
    setTimeout(() => setSuccess(''), 2000)
  }

  const testConnection = async () => {
    if (!pageId || !pageToken) {
      setError('Page ID and token are required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/posts?limit=5&access_token=${pageToken}`)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      setSuccess(`Success! Found ${data.data?.length || 0} recent posts`)
    } catch (err) {
      setError(`Test failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Facebook Integration Setup</h1>
          <p className="text-muted-foreground">
            Connect your Facebook page to automatically sync content to House31
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Setup Steps */}
          <div className="space-y-6">
            
            {/* Step 1: Facebook App */}
            <Card className={step >= 1 ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                  Facebook App Setup
                </CardTitle>
                <CardDescription>
                  Create a Facebook app and get your App ID
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app-id">Facebook App ID</Label>
                  <Input
                    id="app-id"
                    value={facebookAppId}
                    onChange={(e) => setFacebookAppId(e.target.value)}
                    placeholder="123456789012345"
                  />
                </div>
                <Button 
                  onClick={() => window.open('https://developers.facebook.com/apps/', '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Create Facebook App
                </Button>
              </CardContent>
            </Card>

            {/* Step 2: User Token */}
            <Card className={step >= 2 ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
                  Get User Access Token
                </CardTitle>
                <CardDescription>
                  Authorize your app to access your Facebook pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-token">User Access Token</Label>
                  <Input
                    id="user-token"
                    value={userToken}
                    onChange={(e) => setUserToken(e.target.value)}
                    placeholder="Paste token here or use button below"
                  />
                </div>
                <Button 
                  onClick={handleGetUserToken}
                  disabled={!facebookAppId}
                  className="w-full"
                >
                  Get User Token
                </Button>
              </CardContent>
            </Card>

            {/* Step 3: Page Token */}
            <Card className={step >= 3 ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">3</span>
                  Get Page Access Token
                </CardTitle>
                <CardDescription>
                  Get a long-lived token for your Facebook page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-id">Page ID</Label>
                    <Input
                      id="page-id"
                      value={pageId}
                      onChange={(e) => setPageId(e.target.value)}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Actions</Label>
                    <Button 
                      onClick={handleGetPageToken}
                      disabled={!userToken || isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Loading...' : 'Get Page Token'}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="page-token">Page Access Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="page-token"
                      value={pageToken}
                      onChange={(e) => setPageToken(e.target.value)}
                      type="password"
                      readOnly
                    />
                    <Button
                      onClick={() => copyToClipboard(pageToken)}
                      disabled={!pageToken}
                      size="icon"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Instructions & Environment Variables */}
          <div className="space-y-6">
            
            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>
                  Add these to your Vercel project settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>FACEBOOK_PAGE_ID</Label>
                  <div className="flex gap-2">
                    <Input value={pageId || 'your_page_id'} readOnly />
                    <Button
                      onClick={() => copyToClipboard(pageId)}
                      disabled={!pageId}
                      size="icon"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>FACEBOOK_PAGE_ACCESS_TOKEN</Label>
                  <div className="flex gap-2">
                    <Input value={pageToken || 'your_page_access_token'} type="password" readOnly />
                    <Button
                      onClick={() => copyToClipboard(pageToken)}
                      disabled={!pageToken}
                      size="icon"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>FACEBOOK_APP_ID</Label>
                  <div className="flex gap-2">
                    <Input value={facebookAppId || 'your_app_id'} readOnly />
                    <Button
                      onClick={() => copyToClipboard(facebookAppId)}
                      disabled={!facebookAppId}
                      size="icon"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Connection */}
            <Card>
              <CardHeader>
                <CardTitle>Test Connection</CardTitle>
                <CardDescription>
                  Verify your Facebook integration is working
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testConnection}
                  disabled={!pageId || !pageToken || isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Testing...' : 'Test Facebook Connection'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => window.open('https://developers.facebook.com/tools/explorer/', '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Graph API Explorer
                </Button>
                <Button 
                  onClick={() => window.open('/api/facebook-sync', '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Test Sync API
                </Button>
                <Button 
                  onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Vercel Dashboard
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
