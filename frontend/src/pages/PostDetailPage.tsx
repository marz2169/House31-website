import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api'
import type { Post } from '@/services/api'
import { getAuthorName } from '@/lib/helpers'
import SEO from '@/components/SEO'
import LazyLoad from '@/components/LazyLoad'

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return

      try {
        setLoading(true)
        const fetchedPost = await api.getPostBySlug(slug)
        
        if (!fetchedPost) {
          // Generate mock post data
          const mockPost: Post = {
            _id: '1',
            title: `Article: ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
            content: `
              <p>This is the opening paragraph of the article. It provides an engaging introduction to the topic and sets the stage for the detailed content that follows.</p>
              
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>

              <h2>Key Points</h2>
              <ul>
                <li>Important point number one about the topic</li>
                <li>Second crucial detail that readers should know</li>
                <li>Third significant aspect of the story</li>
              </ul>

              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            `,
            excerpt: 'This is a detailed article that provides comprehensive coverage of the topic with expert insights and analysis.',
            category: slug.includes('video') ? 'videos' : slug.includes('entertainment') ? 'entertainment' : 'news',
            slug,
            featuredImage: 'https://via.placeholder.com/800x400?text=Featured+Image',
            videoUrl: slug.includes('video') ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
            author: 'John Doe',
            publishedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ['featured', 'important', 'trending'],
          }
          setPost(mockPost)
        } else {
          setPost(fetchedPost)
        }

        // Fetch related posts
        const category = fetchedPost?.category || (slug.includes('video') ? 'videos' : slug.includes('entertainment') ? 'entertainment' : 'news')
        const { posts } = await api.getPostsByCategory(category, 1, 3)
        setRelatedPosts(posts.slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const handleShare = (platform: string) => {
    if (!post) return

    const url = window.location.href
    const text = post.title

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO 
        title={post.title}
        description={post.excerpt}
        image={post.featuredImage}
        type="article"
        publishedAt={post.publishedAt}
        author={getAuthorName(post.author)}
        tags={post.tags}
      />
      <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
              <li>/</li>
              <li><Link to={`/${post.category}`} className="hover:text-blue-600">{post.category.charAt(0).toUpperCase() + post.category.slice(1)}</Link></li>
              <li>/</li>
              <li className="text-gray-900">Article</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-4">
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </span>
            <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ fontSize: '2.25rem', margin: '0 0 1rem 0' }}>
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-500">
              <span>By {getAuthorName(post.author)}</span>
              <span>•</span>
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <LazyLoad height={384} className="rounded-lg overflow-hidden">
                <img 
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </LazyLoad>
            </div>
          )}

          {/* Video Player */}
          {post.videoUrl && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Featured Video</h3>
              <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <ReactPlayer
                  url={post.videoUrl}
                  width="100%"
                  height="100%"
                  controls={true}
                  light={true}
                  playing={false}
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Share Buttons */}
          <div className="border-t border-b py-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Share this article</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="sm" onClick={() => handleShare('facebook')}>
                Share on Facebook
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}>
                Share on Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare('linkedin')}>
                Share on LinkedIn
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare('copy')}>
                Copy Link
              </Button>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost._id} to={`/post/${relatedPost.slug}`} className="block">
                    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <LazyLoad height={128}>
                        <img 
                          src={relatedPost.featuredImage || `https://via.placeholder.com/300x200?text=${relatedPost.category}`}
                          alt={relatedPost.title}
                          className="w-full h-32 object-cover"
                        />
                      </LazyLoad>
                      <div className="p-4">
                        <h4 className="font-bold mb-2 line-clamp-2">{relatedPost.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <Button size="sm" variant="outline">Read More</Button>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
