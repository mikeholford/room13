import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    text: String,
    speed: { type: Number, default: 100 },
    delay: { type: Number, default: 500 }
  }

  connect() {
    // Store original text
    this.originalText = this.element.textContent.trim()
    this.fullText = this.textValue || this.originalText

    // Initialize element
    this.element.textContent = ''
    this.element.style.opacity = '0'

    // Set fixed height to prevent layout shift
    this.setFixedHeight()

    // Setup intersection observer
    this.setupIntersectionObserver()
  }

  setFixedHeight() {
    // Temporarily set full text to measure dimensions
    const originalContent = this.element.textContent
    this.element.textContent = this.fullText
    this.element.style.opacity = '0' // Keep invisible during measurement
    this.element.style.position = 'relative' // Ensure proper measurement

    // Force layout recalculation
    this.element.offsetHeight

    // Get the computed dimensions
    const height = this.element.offsetHeight
    const width = this.element.offsetWidth

    // Set fixed dimensions to prevent layout shift
    this.element.style.height = height + 'px'
    this.element.style.width = width + 'px'
    this.element.style.minHeight = height + 'px'
    this.element.style.maxHeight = height + 'px'
    this.element.style.overflow = 'hidden' // Prevent any overflow
    this.element.style.whiteSpace = 'pre-wrap' // Maintain text formatting

    // Reset content back to empty
    this.element.textContent = ''
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true
          this.startTyping()
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    })

    this.observer.observe(this.element)
  }

  async startTyping() {
    // Initial delay
    await this.sleep(this.delayValue)

    // Make element visible with smooth transition
    this.element.style.opacity = '1'
    this.element.style.transition = 'opacity 0.3s ease-in-out'

    // Start typing animation
    this.currentIndex = 0
    this.intervalId = setInterval(() => {
      if (this.currentIndex < this.fullText.length) {
        this.element.textContent = this.fullText.slice(0, this.currentIndex + 1)
        this.currentIndex++
      } else {
        this.finishTyping()
      }
    }, this.speedValue)
  }

  finishTyping() {
    clearInterval(this.intervalId)
    this.intervalId = null
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
