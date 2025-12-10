import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["overlay", "hamburger"]

  connect() {
    // Close menu with Escape key
    this.escapeHandler = (event) => {
      if (event.key === "Escape") {
        this.close()
      }
    }
    document.addEventListener("keydown", this.escapeHandler)
  }

  disconnect() {
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler)
    }
  }

  toggle() {
    const isOpen = !this.overlayTarget.classList.contains("pointer-events-none")
    
    if (isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    // Show overlay with fade in
    this.overlayTarget.classList.remove("opacity-0", "pointer-events-none")
    this.overlayTarget.classList.add("opacity-100")
    
    // Animate hamburger to X
    this.hamburgerTarget.classList.add("open")
    
    // Prevent body scroll
    document.body.style.overflow = "hidden"
  }

  close() {
    // Hide overlay with fade out
    this.overlayTarget.classList.remove("opacity-100")
    this.overlayTarget.classList.add("opacity-0", "pointer-events-none")
    
    // Animate X back to hamburger
    this.hamburgerTarget.classList.remove("open")
    
    // Restore body scroll
    document.body.style.overflow = "auto"
  }
}

