import { memo, useCallback, useState } from 'react'
import './IconDialog.css'

function IconDialog({ icon, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(icon.name)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [icon.name])

  return (
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div className="dialog-content">
        <button className="dialog-close" onClick={onClose}>
          ×
        </button>
        <div className="dialog-icon-container">
          <img
            src={icon.path}
            alt={icon.name}
            className="dialog-icon-image"
            loading="eager"
            fetchpriority="high"
          />
        </div>
        <div className="dialog-icon-name-container">
          <input
            type="text"
            value={icon.name}
            readOnly
            className="dialog-icon-name-input"
            onClick={handleCopy}
            onFocus={(e) => e.target.select()}
          />
          <div className="dialog-copy-hint">
            {copied ? '✓ Copied!' : 'Click to copy'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(IconDialog)
