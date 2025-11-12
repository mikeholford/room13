import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["field", "error", "submit", "submitError"]

  validateField(event) {
    const field = event.target
    const errorElement = this.getErrorElement(field)
    
    if (!errorElement) return

    // Clear previous error
    this.clearError(field, errorElement)

    // Validate the field
    if (field.hasAttribute('required') && !field.value.trim()) {
      this.showError(field, errorElement, `${this.getFieldLabel(field)} is required`)
      return false
    }

    // Email validation
    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(field.value.trim())) {
        this.showError(field, errorElement, 'Please enter a valid email address')
        return false
      }
    }

    return true
  }

  validateAll(event) {
    let hasErrors = false

    this.fieldTargets.forEach(field => {
      const errorElement = this.getErrorElement(field)
      if (!errorElement) return

      // Clear previous error
      this.clearError(field, errorElement)

      // Validate required fields
      if (field.hasAttribute('required') && !field.value.trim()) {
        this.showError(field, errorElement, `${this.getFieldLabel(field)} is required`)
        hasErrors = true
      }

      // Email validation
      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(field.value.trim())) {
          this.showError(field, errorElement, 'Please enter a valid email address')
          hasErrors = true
        }
      }
    })

    if (hasErrors) {
      event.preventDefault()
      
      // Show submit error message
      if (this.hasSubmitErrorTarget) {
        this.submitErrorTarget.classList.remove('hidden')
      }

      // Scroll to first error
      const firstError = this.element.querySelector('.border-red-500')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    } else {
      // Hide submit error message
      if (this.hasSubmitErrorTarget) {
        this.submitErrorTarget.classList.add('hidden')
      }
    }

    return !hasErrors
  }

  getErrorElement(field) {
    // Find the error element that's a sibling of the field
    const parent = field.parentElement
    return parent.querySelector('[data-form-validation-target="error"]')
  }

  getFieldLabel(field) {
    const label = field.previousElementSibling
    if (label && label.tagName === 'LABEL') {
      return label.textContent.replace('*', '').trim()
    }
    return 'This field'
  }

  showError(field, errorElement, message) {
    errorElement.textContent = message
    errorElement.classList.remove('hidden')
    field.classList.add('border-red-500')
    field.classList.remove('border-gray-300')
  }

  clearError(field, errorElement) {
    errorElement.textContent = ''
    errorElement.classList.add('hidden')
    field.classList.remove('border-red-500')
    field.classList.add('border-gray-300')
  }
}

