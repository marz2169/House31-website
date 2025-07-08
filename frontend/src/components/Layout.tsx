import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'
import Search from '@/components/Search'
import { ThemeToggle } from '@/components/ThemeToggle'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'NEWS', href: '/news', icon: 'mdi:newspaper' },
    { name: 'VIDEOS', href: '/videos', icon: 'mdi:play-circle' },
    { name: 'ENTERTAINMENT', href: '/entertainment', icon: 'mdi:movie' },
    { name: 'CATEGORIES', href: '/news', icon: 'mdi:menu' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-black dark:text-white">
      {/* Header */}
      <header className="bg-background dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-foreground dark:text-white hover:text-primary dark:hover:text-gray-300 transition-colors">
                <Icon icon="mdi:home-city" className="w-8 h-8" />
                <span>House31</span>
              </Link>
            </motion.div>

            {/* Navigation */}
            <motion.nav 
              className="hidden md:flex space-x-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-2 text-sm font-bold uppercase tracking-wide transition-colors hover:text-primary dark:hover:text-white ${
                      location.pathname === item.href
                        ? 'text-primary dark:text-white border-b-2 border-primary dark:border-white pb-1'
                        : 'text-muted-foreground dark:text-gray-400'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            {/* Search */}
            <div className="hidden md:block">
              <Search />
            </div>

            {/* Theme Toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <motion.button 
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'menu'}
                initial={{ rotate: 0 }}
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Icon 
                  icon={isMobileMenuOpen ? "mdi:close" : "mdi:menu"} 
                  className="w-6 h-6 text-foreground dark:text-white" 
                />
              </motion.div>
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t border-gray-800 bg-black"
              >
                <div className="p-4">
                  <Search />
                </div>
                <motion.nav 
                  className="py-4 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-800 ${
                          location.pathname === item.href
                            ? 'text-white bg-gray-800 border-r-2 border-white'
                            : 'text-gray-400'
                        }`}
                      >
                        <Icon icon={item.icon} className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        key={location.pathname}
      >
        {children}
      </motion.main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">House31</h3>
              <p className="text-gray-400">
                Your trusted source for news, entertainment, and trending videos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <Icon icon="mdi:tag" className="w-5 h-5 mr-2" />
                Categories
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/news" className="hover:text-white flex items-center space-x-2">
                    <Icon icon="mdi:newspaper" className="w-4 h-4" />
                    <span>News</span>
                  </Link>
                </li>
                <li>
                  <Link to="/entertainment" className="hover:text-white flex items-center space-x-2">
                    <Icon icon="mdi:movie" className="w-4 h-4" />
                    <span>Entertainment</span>
                  </Link>
                </li>
                <li>
                  <Link to="/videos" className="hover:text-white flex items-center space-x-2">
                    <Icon icon="mdi:play-circle" className="w-4 h-4" />
                    <span>Videos</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <Icon icon="mdi:information" className="w-5 h-5 mr-2" />
                Company
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white flex items-center space-x-2">
                    <Icon icon="mdi:account-group" className="w-4 h-4" />
                    <span>About Us</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white flex items-center space-x-2">
                    <Icon icon="mdi:email" className="w-4 h-4" />
                    <span>Contact</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white flex items-center space-x-2">
                    <Icon icon="mdi:shield-check" className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <Icon icon="mdi:account-group" className="w-5 h-5 mr-2" />
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <motion.a 
                  href="#" 
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon icon="mdi:facebook" className="w-6 h-6" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon icon="mdi:twitter" className="w-6 h-6" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon icon="mdi:instagram" className="w-6 h-6" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon icon="mdi:youtube" className="w-6 h-6" />
                </motion.a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 House31. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
