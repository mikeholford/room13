import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "image", "text"]
  
  connect() {
    this.mouseX = 0
    this.mouseY = 0
    this.currentX = 0
    this.currentY = 0
    this.isAnimating = false
    this.scrollY = 0

    // Cache element rect
    this.updateRect()

    // Set initial styles for smooth animation
    this.imageTargets.forEach((image) => {
      image.style.willChange = 'transform'
      image.style.transition = 'none'
    })

    this.boundHandleMouseMove = this.handleMouseMove.bind(this)
    this.boundHandleScroll = this.handleScroll.bind(this)
    this.boundHandleResize = this.updateRect.bind(this)
    this.boundAnimate = this.animate.bind(this)

    this.element.addEventListener("mousemove", this.boundHandleMouseMove, { passive: true })
    window.addEventListener("scroll", this.boundHandleScroll, { passive: true })
    window.addEventListener("resize", this.boundHandleResize)

    // Trigger initial animation after a short delay
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.triggerInitialAnimation()
      }, 100)
    })

    // Start animation loop
    this.animate()
  }
  
  triggerInitialAnimation() {
    if (this.hasTextTarget) {
      this.textTargets.forEach((el) => {
        el.classList.remove('opacity-0', 'translate-y-5')
      })
    }
  }

  disconnect() {
    this.element.removeEventListener("mousemove", this.boundHandleMouseMove)
    window.removeEventListener("scroll", this.boundHandleScroll)
    window.removeEventListener("resize", this.boundHandleResize)
    this.isAnimating = false
  }
  
  updateRect() {
    const rect = this.element.getBoundingClientRect()
    this.centerX = rect.width / 2
    this.centerY = rect.height / 2
    this.rect = rect
    // Distance over which text fades out (half the hero height)
    this.fadeDistance = Math.max(1, rect.height * 0.5)
  }
  
  handleMouseMove(event) {
    // Calculate mouse position relative to center (normalized between -1 and 1)
    this.mouseX = (event.clientX - this.rect.left - this.centerX) / this.centerX
    this.mouseY = (event.clientY - this.rect.top - this.centerY) / this.centerY
  }
  
  handleScroll() {
    this.scrollY = window.scrollY
  }
  
  animate() {
    if (!this.isAnimating) {
      this.isAnimating = true
    }
    
    // Smooth interpolation for fluid movement
    const easing = 0.1
    this.currentX += (this.mouseX - this.currentX) * easing
    this.currentY += (this.mouseY - this.currentY) * easing
    
    // Apply parallax effect to each image
    this.imageTargets.forEach((image) => {
      const speed = parseFloat(image.dataset.speed) || 0.5
      
      // Mouse-based parallax movement
      const mouseTranslateX = -this.currentX * speed * 30
      const mouseTranslateY = -this.currentY * speed * 30
      
      // Scroll-based movement - images slide down as you scroll
      const scrollTranslateY = this.scrollY * speed * 1.2
      
      // Combine mouse and scroll movement
      const translateX = mouseTranslateX
      const translateY = mouseTranslateY + scrollTranslateY
      
      // Use transform3d for hardware acceleration
      image.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`
    })

    
    // Continue animation loop
    requestAnimationFrame(() => this.animate())
  }
}
