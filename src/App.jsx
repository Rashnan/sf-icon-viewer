import { useState, useEffect, useMemo, useRef } from 'react'
import IconGrid from './components/IconGrid'
import IconDialog from './components/IconDialog'
import SearchBar from './components/SearchBar'
import ScrollToTop from './components/ScrollToTop'
import { useDebounce } from './hooks/useDebounce'
import { useTheme } from './context/ThemeContext'
import './App.css'

function App() {
  const [icons, setIcons] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [displayCount, setDisplayCount] = useState(40)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Load icons using the existing icons.txt list in /public
  useEffect(() => {
    fetch('/icons.txt')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load icons.txt: ${res.status}`)
        return res.text()
      })
      .then(text => {
        const iconNames = text
          .split('\n')
          .map(name => name.trim())
          .filter(Boolean)

        const iconList = iconNames.map(name => ({
          name: name.replace('@10x.png', '').replace('.png', ''),
          filename: name,
          path: `/SF-Icons/${name}` // Icons live in public/SF-Icons
        }))

        setIcons(iconList)
      })
      .catch((error) => {
        console.error('Error loading icons list:', error)
      })
  }, [])

  // Memoize filtered icons for performance
  const filteredIcons = useMemo(() => {
    if (debouncedSearchQuery.trim() === '') {
      return icons
    }
    const query = debouncedSearchQuery.toLowerCase()
    return icons.filter(icon =>
      icon.name.toLowerCase().includes(query)
    )
  }, [debouncedSearchQuery, icons])

  // Reset display batch when the filtered list changes
  useEffect(() => {
    setDisplayCount(Math.min(40, filteredIcons.length))
  }, [filteredIcons.length])

  const scrollIdleTimeoutRef = useRef(null)
  const BATCH_SIZE = 40
  const SCROLL_IDLE_MS = 200

  // Load more icons in 40-item batches after scroll stops for 200ms
  useEffect(() => {
    const loadNextBatch = () => {
      setDisplayCount(prev => {
        if (prev >= filteredIcons.length) return prev
        return Math.min(prev + BATCH_SIZE, filteredIcons.length)
      })
    }

    const handleScroll = () => {
      if (scrollIdleTimeoutRef.current) {
        clearTimeout(scrollIdleTimeoutRef.current)
      }

      scrollIdleTimeoutRef.current = setTimeout(loadNextBatch, SCROLL_IDLE_MS)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollIdleTimeoutRef.current) {
        clearTimeout(scrollIdleTimeoutRef.current)
      }
    }
  }, [filteredIcons.length])

  const preloadedSrcsRef = useRef(new Set())

  // When opening the dialog, preload the clicked icon and nearby icons for faster viewing
  useEffect(() => {
    if (!isDialogOpen || !selectedIcon) return

    const index = filteredIcons.findIndex(icon => icon.filename === selectedIcon.filename)
    if (index === -1) return

    const start = Math.max(0, index - 20)
    const end = Math.min(filteredIcons.length, index + 21) // include the clicked icon + next 20
    const nearbyIcons = filteredIcons.slice(start, end)

    nearbyIcons.forEach(icon => {
      const src = icon.path
      if (preloadedSrcsRef.current.has(src)) return
      const img = new Image()
      img.src = src
      preloadedSrcsRef.current.add(src)
    })
  }, [isDialogOpen, selectedIcon, filteredIcons])

  const handleIconClick = (icon) => {
    setSelectedIcon(icon)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedIcon(null)
  }

  const { theme, toggleTheme } = useTheme()

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <h1>SF Icons Viewer</h1>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="app-credits">
          <span className="credits-text">
            Icons from <a href="https://github.com/Z3d0X" target="_blank" rel="noopener noreferrer" className="credit-link">Z3d0X</a>
          </span>
          <span className="credits-separator">•</span>
          <span className="credits-text">
            Website by <a href="https://github.com/Rashnan" target="_blank" rel="noopener noreferrer" className="credit-link">RashDev</a>
          </span>
        </div>
      </header>
      <main className="app-main">
        <div className="results-info">
          Showing {filteredIcons.length} of {icons.length} icons
        </div>
        <IconGrid
          icons={filteredIcons.slice(0, displayCount)}
          onIconClick={handleIconClick}
        />
      </main>
      {isDialogOpen && selectedIcon && (
        <IconDialog
          icon={selectedIcon}
          onClose={handleCloseDialog}
        />
      )}
      <ScrollToTop />
    </div>
  )
}

export default App

