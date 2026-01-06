import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react'
import './IconGrid.css'

// Height approximates card + grid row gap; keep a bit larger than real to avoid under-rendering
const ITEM_HEIGHT = 220
const BUFFER = 6

function IconGrid({ icons, onIconClick }) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 })
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Calculate items per row based on container width
  // Account for padding and gaps between items
  // On mobile, force 3 items per row with smaller sizing
  const itemsPerRow = useMemo(() => {
    if (containerWidth === 0) return 6
    const isMobile = window.innerWidth <= 768
    if (isMobile) {
      return 3 // Force 3 items per row on mobile
    }
    const padding = 32 // 1rem on each side
    const minItemWidth = 150
    const gap = 24 // 1.5rem gap
    const availableWidth = containerWidth - padding
    return Math.max(1, Math.floor((availableWidth + gap) / (minItemWidth + gap)))
  }, [containerWidth])

  const totalRows = Math.ceil(icons.length / itemsPerRow)

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth, { passive: true })
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Handle window scroll to update visible range
  const handleScroll = useCallback(() => {
    if (itemsPerRow === 0 || !containerRef.current) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    
    // Get the container's position relative to the viewport
    const containerRect = containerRef.current.getBoundingClientRect()
    const containerTop = containerRect.top + scrollTop
    
    // Calculate visible area relative to container
    const relativeScrollTop = Math.max(0, scrollTop - containerTop)
    const relativeScrollBottom = relativeScrollTop + windowHeight

    const startRow = Math.max(0, Math.floor(relativeScrollTop / ITEM_HEIGHT) - BUFFER)
    const endRow = Math.min(
      totalRows - 1,
      Math.ceil(relativeScrollBottom / ITEM_HEIGHT) + BUFFER
    )

    const start = startRow * itemsPerRow
    const end = Math.min(icons.length, (endRow + 1) * itemsPerRow)

    setVisibleRange({ start, end })
  }, [icons.length, itemsPerRow, totalRows])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  if (icons.length === 0) {
    return (
      <div className="icon-grid-empty">
        <p>No icons found. Loading...</p>
      </div>
    )
  }

  const visibleIcons = icons.slice(visibleRange.start, visibleRange.end)
  const startRow = Math.floor(visibleRange.start / itemsPerRow)
  const offsetY = startRow * ITEM_HEIGHT
  const totalHeight = totalRows * ITEM_HEIGHT + 200 // Add padding at bottom

  return (
    <div className="icon-grid-container" ref={containerRef}>
      <div className="icon-grid-spacer" style={{ height: `${totalHeight}px` }} />
      <div
        className="icon-grid"
        style={{
          transform: `translateY(${offsetY}px)`,
          gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`,
        }}
      >
        {visibleIcons.map((icon, index) => {
          const actualIndex = visibleRange.start + index
          return (
            <IconItem
              key={`${icon.filename}-${actualIndex}`}
              icon={icon}
              onClick={() => onIconClick(icon)}
            />
          )
        })}
        {visibleRange.end >= icons.length && icons.length > 0 && (
          <div className="icon-grid-end">
            No more icons to display
          </div>
        )}
      </div>
    </div>
  )
}

const IconItem = memo(({ icon, onClick }) => {
  return (
    <div className="icon-item" onClick={onClick}>
      <div className="icon-image-container">
        <img
          src={icon.path}
          alt={icon.name}
          className="icon-image"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="icon-name">{icon.name}</div>
    </div>
  )
})

IconItem.displayName = 'IconItem'

export default memo(IconGrid)
