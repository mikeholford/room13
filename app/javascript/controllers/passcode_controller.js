import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "error", "modal"]

  connect() {
    // Auto-focus the first input
    if (this.hasInputTarget) {
      this.inputTargets[0].focus()
      // Prevent body scroll when modal is visible
      document.body.style.overflow = "hidden"
    }
  }

  disconnect() {
    // Restore body scroll when controller is removed
    document.body.style.overflow = "auto"
  }

  handleInput(event) {
    const input = event.target
    const value = input.value

    // Only allow digits
    if (!/^\d*$/.test(value)) {
      input.value = value.replace(/\D/g, '')
      return
    }

    // Auto-advance to next input
    if (value.length === 1 && input.nextElementSibling) {
      input.nextElementSibling.focus()
    }

    // Check if all inputs are filled
    this.checkCompletion()
  }

  handleKeydown(event) {
    const input = event.target

    // Handle backspace
    if (event.key === 'Backspace' && input.value === '' && input.previousElementSibling) {
      input.previousElementSibling.focus()
    }

    // Handle paste
    if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      navigator.clipboard.readText().then(text => {
        this.handlePaste(text)
      })
    }
  }

  handlePaste(text) {
    // Remove non-digits and take only first 6 characters
    const digits = text.replace(/\D/g, '').slice(0, 6)

    // Fill inputs with digits
    this.inputTargets.forEach((input, index) => {
      if (digits[index]) {
        input.value = digits[index]
      }
    })

    // Focus the next empty input or last input
    const nextEmpty = this.inputTargets.find(input => input.value === '')
    if (nextEmpty) {
      nextEmpty.focus()
    } else {
      this.inputTargets[5].focus()
    }

    this.checkCompletion()
  }

  checkCompletion() {
    const allFilled = this.inputTargets.every(input => input.value.length === 1)

    if (allFilled) {
      this.submitPasscode()
    }
  }

  async submitPasscode() {
    const passcode = this.inputTargets.map(input => input.value).join('')
    const eventSlug = this.element.dataset.eventSlug

    // Get CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content

    try {
      const response = await fetch(`/${eventSlug}/verify_passcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ passcode })
      })

      const data = await response.json()

      if (data.success) {
        // Hide the modal and reload the page
        this.modalTarget.classList.add('opacity-0', 'pointer-events-none')
        setTimeout(() => {
          window.location.reload()
        }, 300)
      } else {
        // Show error and clear inputs
        this.showError('Incorrect passcode')
        this.clearInputs()
      }
    } catch (error) {
      this.showError('An error occurred. Please try again.')
      this.clearInputs()
    }
  }

  showError(message) {
    if (this.hasErrorTarget) {
      this.errorTarget.textContent = message
      this.errorTarget.classList.remove('opacity-0')

      // Add shake animation to inputs
      this.inputTargets.forEach(input => {
        input.classList.add('animate-shake')
      })

      setTimeout(() => {
        this.inputTargets.forEach(input => {
          input.classList.remove('animate-shake')
        })
      }, 500)
    }
  }

  clearInputs() {
    this.inputTargets.forEach(input => {
      input.value = ''
    })
    this.inputTargets[0].focus()

    if (this.hasErrorTarget) {
      setTimeout(() => {
        this.errorTarget.classList.add('opacity-0')
      }, 3000)
    }
  }
}
