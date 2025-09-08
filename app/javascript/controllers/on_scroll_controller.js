import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    add: String,
    remove: String,
    delay: { type: Number, default: 0 },
    repeat: { type: Boolean, default: true }
  }

  connect() {
    // Set initial state by applying remove classes
    if (this.removeValue) {
      this.removeValue.split(' ').forEach(className => {
        if (className) this.element.classList.add(className)
      })
    }
    
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.2,
        rootMargin: "0px"
      }
    )
    this.observer.observe(this.element)
  }

  disconnect() {
    this.observer.disconnect()
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          if (this.addValue) {
            this.addValue.split(' ').forEach(className => {
              if (className) entry.target.classList.add(className)
            })
          }
          if (this.removeValue) {
            this.removeValue.split(' ').forEach(className => {
              if (className) entry.target.classList.remove(className)
            })
          }
        }, this.delayValue)
      } else if (this.repeatValue) {
        if (this.addValue) {
          this.addValue.split(' ').forEach(className => {
            if (className) entry.target.classList.remove(className)
          })
        }
        if (this.removeValue) {
          this.removeValue.split(' ').forEach(className => {
            if (className) entry.target.classList.add(className)
          })
        }
      }
    })
  }
} 