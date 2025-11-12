import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "modal"]

  connect() {
    // Only initialize if modal target exists
    if (!this.hasModalTarget) return

    // Close modal when clicking outside
    this.modalTarget.addEventListener("click", (event) => {
      if (event.target === this.modalTarget) {
        this.close()
      }
    })

    // Close modal with Escape key
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

  open() {
    if (!this.hasModalTarget || !this.hasContentTarget) return

    // Show modal with animation
    this.modalTarget.classList.remove("opacity-0", "pointer-events-none")
    this.contentTarget.classList.remove("scale-95")
    this.contentTarget.classList.add("scale-100")
    
    // Prevent body scroll
    document.body.style.overflow = "hidden"
  }

  close() {
    if (!this.hasModalTarget || !this.hasContentTarget) return

    // Hide modal with animation
    this.modalTarget.classList.add("opacity-0", "pointer-events-none")
    this.contentTarget.classList.remove("scale-100")
    this.contentTarget.classList.add("scale-95")
    
    // Restore body scroll
    document.body.style.overflow = "auto"
  }
}
