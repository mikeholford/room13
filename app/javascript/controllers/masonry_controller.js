import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["grid", "item"]
  static values = {
    columns: { type: Number, default: 3 },
    gap: { type: Number, default: 24 }
  }

  connect() {
    this.observer = null
    this.loadedImages = new Set()
    this.columnHeights = []
    this.initializeColumns()
    this.setupIntersectionObserver()
    this.setupResizeObserver()

    // Load immediate images first, then observe lazy ones
    this.loadImmediateImages()
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  }

  initializeColumns() {
    // Determine number of columns based on viewport width
    const width = window.innerWidth
    if (width < 768) {
      this.currentColumns = 1
    } else if (width < 1024) {
      this.currentColumns = 2
    } else {
      this.currentColumns = 3
    }

    // Initialize column heights
    this.columnHeights = new Array(this.currentColumns).fill(0)
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '200px', // Start loading 200px before entering viewport
      threshold: 0.01
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target)
        }
      })
    }, options)
  }

  setupResizeObserver() {
    let resizeTimeout
    this.resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        this.initializeColumns()
        this.relayout()
      }, 150)
    })

    if (this.hasGridTarget) {
      this.resizeObserver.observe(this.gridTarget)
    }
  }

  loadImmediateImages() {
    // Process items that should load immediately (have src, not data-src)
    this.itemTargets.forEach(item => {
      const img = item.querySelector('img')
      if (img && !img.dataset.src) {
        // This is an immediate-load image
        if (img.complete) {
          this.handleImageLoaded(item, img)
        } else {
          img.addEventListener('load', () => this.handleImageLoaded(item, img), { once: true })
        }
      }
    })

    // After a short delay, start observing lazy-load images
    setTimeout(() => {
      this.observeLazyItems()
    }, 100)
  }

  observeLazyItems() {
    this.itemTargets.forEach(item => {
      const img = item.querySelector('img')
      if (img && img.dataset.src && !this.loadedImages.has(item)) {
        this.observer.observe(item)
      }
    })
  }

  handleImageLoaded(item, img) {
    this.loadedImages.add(item)
    item.style.transition = 'opacity 0.3s ease-in-out'
    item.style.opacity = '1'
    this.positionItem(item)
  }

  loadImage(item) {
    if (this.loadedImages.has(item)) return

    const img = item.querySelector('img')
    const dataSrc = img.dataset.src

    if (!dataSrc) {
      // No data-src, already loaded
      this.handleImageLoaded(item, img)
      return
    }

    // Show loading state
    item.style.opacity = '0.3'

    // Create a new image to preload
    const tempImg = new Image()
    tempImg.onload = () => {
      img.src = dataSrc
      img.removeAttribute('data-src')

      // Wait for the img to complete then handle
      if (img.complete) {
        this.handleImageLoaded(item, img)
      } else {
        img.addEventListener('load', () => this.handleImageLoaded(item, img), { once: true })
      }
    }

    tempImg.onerror = () => {
      console.error('Failed to load image:', dataSrc)
      item.style.opacity = '0.5'
      this.loadedImages.add(item)
    }

    tempImg.src = dataSrc

    // Stop observing this item
    this.observer.unobserve(item)
  }

  positionItem(item) {
    const img = item.querySelector('img')
    if (!img.complete && !img.naturalHeight) {
      // Image not loaded yet, wait for load
      img.addEventListener('load', () => this.positionItem(item), { once: true })
      return
    }

    // Get the index of this item in sequential order
    const itemIndex = this.itemTargets.indexOf(item)

    // Calculate which column this item belongs to based on its index
    const column = itemIndex % this.currentColumns
    const row = Math.floor(itemIndex / this.currentColumns)

    // Calculate position
    const containerWidth = this.gridTarget.offsetWidth
    const columnWidth = (containerWidth - (this.gapValue * (this.currentColumns - 1))) / this.currentColumns
    const left = column * (columnWidth + this.gapValue)

    // Calculate image height based on aspect ratio
    const aspectRatio = img.naturalHeight / img.naturalWidth
    const itemHeight = columnWidth * aspectRatio

    // Calculate top position based on the heights of all items in this column before this one
    let top = 0
    for (let i = column; i < itemIndex; i += this.currentColumns) {
      const previousItem = this.itemTargets[i]
      if (this.loadedImages.has(previousItem)) {
        const previousImg = previousItem.querySelector('img')
        if (previousImg.naturalHeight) {
          const previousAspectRatio = previousImg.naturalHeight / previousImg.naturalWidth
          const previousHeight = columnWidth * previousAspectRatio
          top += previousHeight + this.gapValue
        }
      }
    }

    // Position the item
    item.style.position = 'absolute'
    item.style.left = `${left}px`
    item.style.top = `${top}px`
    item.style.width = `${columnWidth}px`
    item.style.transition = 'all 0.3s ease-in-out'

    // Update column height tracking
    this.columnHeights[column] = top + itemHeight + this.gapValue

    // Update grid container height
    const maxHeight = Math.max(...this.columnHeights)
    this.gridTarget.style.height = `${maxHeight}px`
  }

  relayout() {
    // Reset column heights
    this.columnHeights = new Array(this.currentColumns).fill(0)

    // Re-position all loaded items in order
    // This is important because positioning now depends on previous items in the same column
    this.itemTargets.forEach(item => {
      if (this.loadedImages.has(item)) {
        this.positionItem(item)
      }
    })
  }
}
