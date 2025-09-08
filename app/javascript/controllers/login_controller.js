import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["submitButton", "buttonText", "loadingSpinner", "modal", "modalBackdrop"]

  submitForm(event) {
    event.preventDefault()

    // Get form data (though we won't use it)
    const formData = new FormData(event.target)
    const membershipNumber = formData.get('membership_number')
    const password = formData.get('password')

    // Show loading state
    this.showLoading()

    // Simulate processing delay
    setTimeout(() => {
      this.hideLoading()
      this.showModal()
    }, 1000) // 1 second delay
  }

  showLoading() {
    this.submitButtonTarget.disabled = true
    this.buttonTextTarget.textContent = "Verifying"
    this.loadingSpinnerTarget.classList.remove("hidden")
    this.submitButtonTarget.classList.add("opacity-75", "cursor-not-allowed")
  }

  hideLoading() {
    this.submitButtonTarget.disabled = false
    this.buttonTextTarget.textContent = "Login"
    this.loadingSpinnerTarget.classList.add("hidden")
    this.submitButtonTarget.classList.remove("opacity-75", "cursor-not-allowed")
  }

  showModal() {
    this.modalTarget.classList.remove("hidden")
    this.modalBackdropTarget.classList.remove("hidden")
    document.body.classList.add("overflow-hidden")
  }

  closeModal() {
    this.modalTarget.classList.add("hidden")
    this.modalBackdropTarget.classList.add("hidden")
    document.body.classList.remove("overflow-hidden")
  }
}
